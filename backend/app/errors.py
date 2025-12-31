"""
app/errors.py
---------------

Centralised error handling utilities for the FastAPI application.

By registering custom exception handlers you can control the structure
of error responses globally and avoid leaking implementation details. The
FastAPI documentation describes how to install custom exception handlers
using the ``@app.exception_handler`` decorator【566035945193997†L394-L438】. This module
provides handlers for ``HTTPException`` and ``RequestValidationError``
that return consistent JSON responses without exposing stack traces.
"""

from __future__ import annotations

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle ``HTTPException`` globally.

    Parameters
    ----------
    request: Request
        The incoming request that triggered the exception.
    exc: HTTPException
        The exception instance raised in the application.

    Returns
    -------
    JSONResponse
        A JSON response with the error detail and HTTP status code.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None) or {},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle ``RequestValidationError`` globally.

    Instead of returning the default Pydantic error structure, this handler
    aggregates validation errors into a list of messages. Avoid logging
    entire error objects directly, as they may expose internal information
    (such as file names or line numbers)【566035945193997†L565-L571】.
    """
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid input")
        errors.append({"field": loc, "message": msg})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": errors},
    )