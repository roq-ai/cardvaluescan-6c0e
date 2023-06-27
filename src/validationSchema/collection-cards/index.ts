import * as yup from 'yup';

export const collectionCardValidationSchema = yup.object().shape({
  collection_id: yup.string().nullable(),
  card_id: yup.string().nullable(),
});
