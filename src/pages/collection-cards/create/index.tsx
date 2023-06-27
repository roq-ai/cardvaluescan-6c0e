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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCollectionCard } from 'apiSdk/collection-cards';
import { Error } from 'components/error';
import { collectionCardValidationSchema } from 'validationSchema/collection-cards';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CollectionInterface } from 'interfaces/collection';
import { TradingCardInterface } from 'interfaces/trading-card';
import { getCollections } from 'apiSdk/collections';
import { getTradingCards } from 'apiSdk/trading-cards';
import { CollectionCardInterface } from 'interfaces/collection-card';

function CollectionCardCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CollectionCardInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCollectionCard(values);
      resetForm();
      router.push('/collection-cards');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CollectionCardInterface>({
    initialValues: {
      collection_id: (router.query.collection_id as string) ?? null,
      card_id: (router.query.card_id as string) ?? null,
    },
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
            Create Collection Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'collection_card',
  operation: AccessOperationEnum.CREATE,
})(CollectionCardCreatePage);
