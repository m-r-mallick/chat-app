import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { useModelState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';

const FILE_INPUT_TYPES = '.png, .jpeg, .jpg';
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/pjpeg'];

const isValidFileType = file => ACCEPTED_FILE_TYPES.includes(file.type);

const getBlob = canvas => {
   return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
         if (blob) {
            resolve(blob);
         } else {
            reject(new Error(`File process error!`));
         }
      });
   });
};
const AvatarUploadBtn = () => {
   const { isOpen, open, close } = useModelState();
   const { profile } = useProfile();
   const [image, setImage] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const avatarEditorRef = useRef();

   const onFileInputChange = event => {
      const [currFile] = event.target.files;
      if (isValidFileType(currFile)) {
         setImage(currFile);
         open();
      } else {
         Alert.error(`Invalid file type ${currFile.type}!`, 4000);
      }
   };
   const onUploadClick = async () => {
      const canvas = avatarEditorRef.current.getImageScaledToCanvas();
      setIsLoading(true);
      try {
         const blob = await getBlob(canvas);
         const avatarFileRef = storage
            .ref(`/profiles/${profile.uid}`)
            .child(`avatar`);
         const uploadAvatarResult = await avatarFileRef.put(blob, {
            cacheControl: `public, max-age-${3600 * 24 * 3}`,
         });
         const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
         const userAvatarRef = database
            .ref(`/profiles/${profile.uid}`)
            .child(`avatar`);
         userAvatarRef.set(downloadUrl);
         setIsLoading(false);
         close();
         Alert.info('Avatar url has been updated!', 4000);
      } catch (error) {
         setIsLoading(false);
         close();
         Alert.error(error.message, 4000);
      }
   };
   return (
      <div className="mt-3 text-center">
         <ProfileAvatar
            src={profile.avatar}
            name={profile.name}
            className="width-200 height-200 img-fullsize font-huge"
         />
         <div>
            <label
               htmlFor="avatar-upload"
               className="d-block cursor-pointer padded"
            >
               Select new avatar{' '}
               <input
                  id="avatar-upload"
                  type="file"
                  className="d-none"
                  accept={FILE_INPUT_TYPES}
                  onChange={onFileInputChange}
               />{' '}
            </label>{' '}
            <Modal show={isOpen} onHide={close}>
               <Modal.Header> Adjust and upload new avatar </Modal.Header>{' '}
               <Modal.Body>
                  <div className="d-flex justify-content-center align-items-center h-100">
                     {' '}
                     {image && (
                        <AvatarEditor
                           image={image}
                           width={200}
                           height={200}
                           border={10}
                           borderRadius={100}
                           rotate={0}
                           ref={avatarEditorRef}
                        />
                     )}{' '}
                  </div>{' '}
               </Modal.Body>{' '}
               <Modal.Footer>
                  <Button
                     block
                     appearance="ghost"
                     onClick={onUploadClick}
                     disabled={!isLoading}
                  >
                     Upload new avatar{' '}
                  </Button>{' '}
               </Modal.Footer>{' '}
            </Modal>{' '}
         </div>{' '}
      </div>
   );
};

export default AvatarUploadBtn;
