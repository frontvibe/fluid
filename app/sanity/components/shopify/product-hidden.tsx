import type {StringFieldProps} from 'sanity';

import {WarningOutlineIcon} from '@sanity/icons';
import {Box, Card, Flex, Stack, Text} from '@sanity/ui';
import {useFormValue} from 'sanity';

import {usePluginContext} from '~/sanity/plugins/custom-document-actions/studio-layout';

type Store = {
  id: number;
  isDeleted: boolean;
  status: string;
};

function ProductHiddenInput(props: StringFieldProps) {
  const store: Store = useFormValue(['store']) as Store;
  const {shopifyStoreDomain} = usePluginContext();
  const storeHandle = shopifyStoreDomain.replace('.myshopify.com', '');
  const storeUrl = `https://admin.shopify.com/store/${storeHandle}`;

  let message;
  if (!store) {
    return <></>;
  } else {
    const shopifyProductUrl = `${storeUrl}/products/${store?.id}`;
    const isActive = store?.status === 'active';
    const isDeleted = store?.isDeleted;

    if (!isActive) {
      message = (
        <>
          It does not have an <code>active</code> status in Shopify.
        </>
      );
    }
    if (isDeleted) {
      message = 'It has been deleted from Shopify.';
    }

    return (
      <Card padding={4} radius={2} shadow={1} tone="critical">
        <Flex align="flex-start">
          <Text size={2}>
            <WarningOutlineIcon />
          </Text>
          <Box flex={1} marginLeft={3}>
            <Box>
              <Text size={2} weight="semibold">
                This product is hidden
              </Text>
            </Box>
            <Stack marginTop={4} space={2}>
              <Text size={1}>{message}</Text>
            </Stack>
            {!isDeleted && shopifyProductUrl && (
              <Box marginTop={4}>
                <Text size={1}>
                  →{' '}
                  <a href={shopifyProductUrl} rel="noreferrer" target="_blank">
                    View this product on Shopify
                  </a>
                </Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Card>
    );
  }
}

export default ProductHiddenInput;
