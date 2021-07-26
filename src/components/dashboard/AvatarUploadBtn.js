import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';

const FILE_INPUT_TYPES = '.png, .jpeg, .jpg';
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/pjpeg'];

const isValidFileType = file => ACCEPTED_FILE_TYPES.includes(file.type);
const AvatarUploadBtn = () => {
   const { isOpen, open, close } = useModelState();
   const [image, setImage] = useState(null);
   const onFileInputChange = event => {
      const [currFile] = event.target.files;
      if (isValidFileType(currFile)) {
         setImage(currFile);
         open();
      } else {
         Alert.error(`Invalid file type ${currFile.type}!`, 4000);
      }
   };
   return (
      <div className="mt-3 text-center">
         <div>
            <label
               htmlFor="avatar-upload"
               className="d-block cursor-pointer padded"
            >
               Select new avatar
               <input
                  id="avatar-upload"
                  type="file"
                  className="d-none"
                  accept={FILE_INPUT_TYPES}
                  onChange={onFileInputChange}
               />
            </label>
            <Modal show={isOpen} onHide={close}>
               <Modal.Header>Adjust and upload new avatar</Modal.Header>
               <Modal.Body>
                  <div className="d-flex justify-content-center align-items-center h-100">
                     {image && (
                        <AvatarEditor
                           image={image}
                           width={200}
                           height={200}
                           border={10}
                           borderRadius={100}
                           rotate={0}
                        />
                     )}
                  </div>
               </Modal.Body>
               <Modal.Footer>
                  <Button block appearance="ghost">
                     Upload new avatar
                  </Button>
               </Modal.Footer>
            </Modal>
         </div>
      </div>
   );
};

export default AvatarUploadBtn;
