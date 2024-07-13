import { AccountRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import prisma from "./prisma";

const getTokenFromCookie = (request: NextRequest): string | null => {
  const token = request.cookies.get("token");
  if (!token) {
    return null;
  }
  return token.value;
};

const getTokenFromHeader = (request: NextRequest): string | null => {
  const token = request.headers.get("Authorization");
  if (!token) {
    return null;
  }
  return token;
};

export const getSession = async (request: NextRequest) => {
  const token = getTokenFromCookie(request) ?? getTokenFromHeader(request);
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

  const session = await prisma.account.findUnique({
    where: {
      id: decoded.id,
    },
  });

  return session;
};

export const hasAtLeastRole = (requiredRole: AccountRole, userRole: AccountRole) => {
  const roles = [
    {
      name: AccountRole.ADMIN,
      level: 900,
    },
    {
      name: AccountRole.SUPERVISOR,
      level: 800,
    },
    {
      name: AccountRole.SUPPORT,
      level: 700,
    },
    {
      name: AccountRole.USER,
      level: 600,
    },
    {
      name: AccountRole.UNKNOWN,
      level: 500,
    },
  ];
  const requiredRoleLevel = roles.find((r) => r.name === requiredRole)?.level ?? 1000; // Pour éviter les fails
  const userRoleLevel = roles.find((r) => r.name === userRole)?.level ?? 0;
  return userRoleLevel >= requiredRoleLevel;
};

export const verifyRoleRequired = async (role: AccountRole, request: NextRequest) => {
  const session = await getSession(request);
  if (!session) throw new AuthorizationError("Unauthorized", 401);
  if (!hasAtLeastRole(role, session.role)) throw new AuthorizationError("Forbidden", 403);
};

export class AuthorizationError extends Error {
  status: number;
  constructor(title: string, status: number) {
    super(title);
    this.name = title;
    this.status = status;
  }
}
