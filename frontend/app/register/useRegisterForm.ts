import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "El usuario debe tener al menos 3 caracteres")
        .max(20, "El usuario no debe exceder 20 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Email inválido"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .regex(/[0-9]/, "Debe incluir al menos un número"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const login = useAuthStore((s) => s.login);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setServerError(null);
        try {
            // 1. Register
            await api.register({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            // 2. Auto-login
            const token = await api.login(data.username, data.password);
            login(token.access_token, token.user);

            // 3. Redirect
            router.push("/dashboard");
        } catch (err: any) {
            // Handle specific API errors if possible
            if (err?.message?.includes("already exists")) {
                form.setError("username", { message: "Este usuario ya está registrado" });
            } else {
                setServerError(err.message || "Ocurrió un error inesperado");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        serverError,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
