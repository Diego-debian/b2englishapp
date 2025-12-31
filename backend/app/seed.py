#!/usr/bin/env python3
"""
app/seed.py
Script para poblar la base de datos con datos iniciales.
Carga datos desde 2 archivos JSON: irregular_verbs_b2.json y tenses_activities_seed.json
"""
import json
from pathlib import Path
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import SessionLocal, engine, Base
from app.crud import (
    bulk_create_verbs,
    get_verb_by_infinitive,
    create_tense,
    add_tense_example,
    create_activity,
    add_activity_question,
)


def load_json_data(filename: str) -> dict:
    current_dir = Path(__file__).parent
    data_file = current_dir / "data" / filename
    if not data_file.exists():
        raise FileNotFoundError(f"Data file not found: {data_file}")
    with open(data_file, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_verbs(db: Session, verbs_data: list) -> int:
    print("🌱 Sembrando verbos irregulares...")

    verbs_to_create = []
    for verb_data in verbs_data:
        infinitive = (verb_data.get("infinitive") or "").strip()
        if not infinitive:
            continue
        existing = get_verb_by_infinitive(db, infinitive)
        if not existing:
            verbs_to_create.append(verb_data)

    if not verbs_to_create:
        print("  ✅ Todos los verbos ya existen en la base de datos")
        return 0

    created = bulk_create_verbs(db, verbs_to_create)
    print(f"  ✅ {created} verbos creados exitosamente")
    return created


def _resolve_verb_id(db: Session, ex_data: Dict[str, Any]) -> Optional[int]:
    # 1) verb_id directo
    if ex_data.get("verb_id") is not None:
        try:
            return int(ex_data["verb_id"])
        except Exception:
            return None

    # 2) intentar por infinitivo si lo trae
    for k in ("verb_infinitive", "infinitive", "verb"):
        v = ex_data.get(k)
        if isinstance(v, str) and v.strip():
            verb = get_verb_by_infinitive(db, v.strip())
            if verb:
                return verb.id

    return None


def _infer_correct_answer(q: Dict[str, Any]) -> Optional[str]:
    """
    Intenta inferir correct_answer desde varias formas comunes de JSON:
    - correct_answer / answer / correct / solution / expected
    - correct_index / correctIndex / correct_option_index
    - options/choices como lista de strings o lista de dicts con flags (is_correct, correct)
    """
    # 1) Directos (string)
    for key in ("correct_answer", "answer", "solution", "expected"):
        val = q.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()

    # 1b) Directos pero podrían ser número/bool => los convertimos a string si tiene sentido
    # (no ideal, pero evita crashes)
    for key in ("correct", "correctOption"):
        val = q.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()

    # 2) Si trae índice del correcto
    idx = None
    for key in ("correct_index", "correctIndex", "correct_option_index", "correctOptionIndex"):
        if q.get(key) is not None:
            try:
                idx = int(q.get(key))
            except Exception:
                idx = None
            break

    opts = q.get("options") or q.get("choices")

    if idx is not None and isinstance(opts, list) and 0 <= idx < len(opts):
        opt = opts[idx]
        if isinstance(opt, str):
            return opt.strip()
        if isinstance(opt, dict):
            for k in ("text", "value", "label"):
                v = opt.get(k)
                if isinstance(v, str) and v.strip():
                    return v.strip()

    # 3) Si las opciones vienen como dicts y una está marcada como correcta
    if isinstance(opts, list):
        for opt in opts:
            if isinstance(opt, dict):
                if opt.get("is_correct") is True or opt.get("isCorrect") is True or opt.get("correct") is True:
                    for k in ("text", "value", "label"):
                        v = opt.get(k)
                        if isinstance(v, str) and v.strip():
                            return v.strip()

    return None


def seed_tenses(db: Session, tenses_data: list) -> dict:
    print("🌱 Sembrando tiempos verbales...")

    tense_map: Dict[str, int] = {}

    for tense_data in tenses_data:
        code = tense_data.get("code")
        name = tense_data.get("name")
        if not code or not name:
            print("  ⚠️  Tense inválido (sin code o name). Se omite.")
            continue

        existing = db.execute(
            text("SELECT id FROM tenses WHERE code = :code"),
            {"code": code},
        ).first()

        if existing:
            tense_id = int(existing[0])
            tense_map[code] = tense_id
            print(f"  ⏭️  Tiempo verbal ya existe: {name}")
        else:
            tense = create_tense(db, tense_data)
            tense_id = tense.id
            tense_map[code] = tense_id
            print(f"  ✅ Tiempo verbal creado: {name}")

        # Ejemplos
        examples = tense_data.get("examples", [])
        if examples:
            created_examples = 0
            skipped_examples = 0

            for ex_data in examples:
                if not isinstance(ex_data, dict):
                    skipped_examples += 1
                    continue

                payload = dict(ex_data)
                payload["tense_id"] = tense_id

                # resolver verb_id si es posible
                if payload.get("verb_id") is None:
                    payload["verb_id"] = _resolve_verb_id(db, payload)

                # Si tu modelo exige verb_id y no se puede resolver, omitimos.
                if payload.get("verb_id") is None:
                    skipped_examples += 1
                    sentence_preview = (payload.get("sentence") or "")[:80]
                    print(
                        f"    ⚠️  Ejemplo omitido (tense={code}): no se pudo resolver verb_id | sentence='{sentence_preview}'"
                    )
                    continue

                try:
                    add_tense_example(db, payload)
                    created_examples += 1
                except Exception as e:
                    skipped_examples += 1
                    sentence_preview = (payload.get("sentence") or "")[:80]
                    print(
                        f"    ⚠️  Ejemplo omitido (tense={code}): {e} | sentence='{sentence_preview}'"
                    )

            print(f"    📝 Ejemplos: {created_examples} creados, {skipped_examples} omitidos")

    return tense_map


def seed_activities(db: Session, tenses_data: list, tense_map: dict):
    print("🌱 Sembrando actividades...")

    total_activities = 0
    total_questions = 0
    skipped_questions = 0

    for tense_data in tenses_data:
        code = tense_data.get("code")
        tense_id = tense_map.get(code)
        if not tense_id:
            continue

        activities = tense_data.get("activities", [])
        if not activities:
            continue

        for activity_data in activities:
            if not isinstance(activity_data, dict):
                continue

            # Crear actividad
            payload = dict(activity_data)
            payload["tense_id"] = tense_id

            activity = create_activity(db, payload)
            total_activities += 1

            questions = activity_data.get("questions", [])
            if questions:
                for i, q_data in enumerate(questions):
                    if not isinstance(q_data, dict):
                        skipped_questions += 1
                        continue

                    q_payload = dict(q_data)
                    q_payload["activity_id"] = activity.id

                    # ✅ kind obligatorio
                    if not q_payload.get("kind"):
                        if q_payload.get("type"):
                            q_payload["kind"] = q_payload["type"]
                        elif q_payload.get("question_type"):
                            q_payload["kind"] = q_payload["question_type"]
                        else:
                            q_payload["kind"] = "mcq"

                    # ✅ prompt obligatorio
                    if q_payload.get("prompt") is None:
                        if q_payload.get("question") is not None:
                            q_payload["prompt"] = q_payload["question"]
                        elif q_payload.get("text") is not None:
                            q_payload["prompt"] = q_payload["text"]

                    # ✅ options: mapear choices -> options
                    if q_payload.get("options") is None and q_payload.get("choices") is not None:
                        q_payload["options"] = q_payload["choices"]

                    # ✅ correct_answer: inferir
                    if q_payload.get("correct_answer") is None:
                        inferred = _infer_correct_answer(q_payload)
                        if inferred is not None:
                            q_payload["correct_answer"] = inferred

                    # Defaults
                    if q_payload.get("xp_reward") is None:
                        q_payload["xp_reward"] = 10

                    if q_payload.get("sort_order") is None:
                        q_payload["sort_order"] = i + 1

                    # Guard: si sigue faltando correct_answer, omitimos sin tumbar el seed
                    if q_payload.get("correct_answer") is None:
                        prev = (q_payload.get("prompt") or q_payload.get("question") or "")[:80]
                        print(f"    ⚠️  Pregunta omitida: no se pudo inferir correct_answer | prompt='{prev}'")
                        skipped_questions += 1
                        continue

                    # Insertar pregunta
                    try:
                        add_activity_question(db, q_payload)
                        total_questions += 1
                    except Exception as e:
                        prev = (q_payload.get("prompt") or "")[:80]
                        print(f"    ⚠️  Pregunta omitida por error: {e} | prompt='{prev}'")
                        skipped_questions += 1

            print(f"  ✅ Actividad creada: {activity_data.get('title', 'Sin título')}")

    print(f"  📊 Total: {total_activities} actividades, {total_questions} preguntas, {skipped_questions} omitidas")


def main():
    print("🚀 Iniciando proceso de seed...")

    Base.metadata.create_all(bind=engine)
    print("✅ Tablas verificadas/creadas")

    try:
        verbs_data = load_json_data("irregular_verbs_b2.json")
        tenses_data = load_json_data("tenses_activities_seed.json")
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("💡 Asegúrate de tener los archivos en app/data/")
        return

    db = SessionLocal()
    try:
        verbs_created = seed_verbs(db, verbs_data)
        db.commit()

        tense_map = seed_tenses(db, tenses_data.get("tenses", []))
        db.commit()

        seed_activities(db, tenses_data.get("tenses", []), tense_map)
        db.commit()

        print("\n🎉 Seed completado exitosamente!")
        print("=" * 50)
        print(f"  • Verbos creados: {verbs_created}")
        print(f"  • Tiempos verbales: {len(tenses_data.get('tenses', []))}")
        print("=" * 50)

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error durante el seed: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
