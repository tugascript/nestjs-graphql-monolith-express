import { GraphQLScalarType } from 'graphql/type';

let GraphQLUpload: GraphQLScalarType;

import('graphql-upload/GraphQLUpload.mjs').then(({ default: Upload }) => {
  GraphQLUpload = Upload;
});

export const uploadScalar = () => GraphQLUpload;
