export interface JwtPayload {
  sub: string; // admin ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
