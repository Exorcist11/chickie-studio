import React from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

interface PermissionGateProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { hasRole } = useAuth();

  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
