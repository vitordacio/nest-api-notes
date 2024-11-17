declare type ExpressUser = {
  id: string;
  username: string;
};

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Request {
    user: ExpressUser;
  }
}
