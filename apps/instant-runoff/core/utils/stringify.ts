import { Types } from 'mongoose';

type WithObjectId = {
  _id: Types.ObjectId | string;
  [key: string | number]: unknown;
};

export const stringifyObjectId = <T>(data: WithObjectId) => {
  return {
    ...data,
    _id: data._id.toString(),
  } as T;
};
