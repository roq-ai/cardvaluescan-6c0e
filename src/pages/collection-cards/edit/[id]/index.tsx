import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCollectionCardById, updateCollectionCardById } from 'apiSdk/collection-cards';
import { Error } from 'components/error';
import { collectionCardValidationSchema } from 'validationSchema/collection-cards';
import { CollectionCardInterface } from 'interfaces/collection-card';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CollectionInterface } from 'interfaces/collection';
import { TradingCardInterface } from 'interfaces/trading-card';
import { getCollections } from 'apiSdk/collections';
import { getTradingCards } from 'apiSdk/trading-cards';

function CollectionCardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CollectionCardInterface>(
    () => (id ? `/collection-cards/${id}` : null),
    () => getCollectionCardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CollectionCardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCollectionCardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/collection-cards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CollectionCardInterface>({
    initialValues: data,
    validationSchema: collectionCardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Collection Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<CollectionInterface>
              formik={formik}
              name={'collection_id'}
              label={'Select Collection'}
              placeholder={'Select Collection'}
              fetcher={getCollections}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<TradingCardInterface>
              formik={formik}
              name={'card_id'}
              label={'Select Trading Card'}
              placeholder={'Select Trading Card'}
              fetcher={getTradingCards}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'collection_card',
  operation: AccessOperationEnum.UPDATE,
})(CollectionCardEditPage);
