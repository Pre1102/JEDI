import React from "react";

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "8px" }}>{children}</div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontWeight: "bold", padding: "8px" }}>{children}</div>
);

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span style={{ backgroundColor: "#eee", borderRadius: "12px", padding: "4px 8px" }}>{children}</span>
);