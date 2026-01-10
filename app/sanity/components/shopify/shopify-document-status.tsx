import {CloseIcon, ImageIcon, LinkRemovedIcon} from '@sanity/icons';
import {useState} from 'react';

type Props = React.ComponentProps<'div'> & {
  isActive?: boolean;
  isDeleted: boolean;
  title: string;
  type: 'collection' | 'product' | 'productVariant';
  url: string;
};

function ShopifyDocumentStatus({
  isActive,
  isDeleted,
  title,
  type,
  url,
  ...props
}: Props) {
  const [imageVisible, setImageVisible] = useState(true);

  // Hide image on error / 404
  const handleImageError = () => setImageVisible(false);

  return (
    <div
      style={{
        alignItems: 'center',
        borderRadius: 'inherit',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100%',
      }}
      {...props}
    >
      {imageVisible && url ? (
        <img
          alt={`${title} preview`}
          onError={handleImageError}
          src={`${url}&width=400`}
          style={{
            height: '100%',
            left: 0,
            objectFit: 'contain',
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        />
      ) : (
        <ImageIcon style={{position: 'absolute'}} />
      )}

      {/* Item has been deleted */}
      {isDeleted ? (
        <CloseIcon
          style={{
            background: 'rgba(255, 0, 0, 0.7)',
            color: 'rgba(255, 255, 255, 0.85)',
            height: '100%',
            position: 'relative',
            width: '100%',
          }}
        />
      ) : (
        <>
          {/* Products only: item is no longer active */}
          {type === 'product' && !isActive && (
            <LinkRemovedIcon
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'rgba(255, 255, 255, 0.85)',
                height: '100%',
                position: 'relative',
                width: '100%',
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ShopifyDocumentStatus;
