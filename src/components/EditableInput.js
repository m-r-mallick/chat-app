import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
   initialValue,
   onSave,
   label = null,
   placeholder = 'Enter value',
   emptyMessage = 'Input is empty!',
   ...inputProps
}) => {
   const [input, setInput] = useState(initialValue);
   const [isEditable, setIsEditable] = useState(false);

   const onInputChange = useCallback(value => {
      setInput(value);
   }, []);
   const onEditClick = useCallback(() => {
      setIsEditable(prevState => !prevState);
      setInput(initialValue);
   }, []);
   const onSaveClick = async () => {
      const trimmed = input.trim();
      if (trimmed === '') {
         Alert.error(emptyMessage);
      }
      if (trimmed !== '' && trimmed !== initialValue) {
         await onSave(trimmed);
      }
      setIsEditable(false);
   };
   const onClearClick = useCallback(() => {
      if (input !== '') {
         Alert.info('Cleared!', 2000);
      }
      setInput('');
   }, []);
   return (
      <div>
         {label}
         <InputGroup>
            <Input
               {...inputProps}
               disabled={!isEditable}
               placeholder={placeholder}
               value={input}
               onChange={onInputChange}
            />
            {isEditable && (
               <InputGroup.Button onClick={onClearClick}>
                  <Icon icon="trash2" />
               </InputGroup.Button>
            )}

            <InputGroup.Button onClick={onEditClick}>
               <Icon icon={isEditable ? 'close' : 'edit2'} />
            </InputGroup.Button>
            {isEditable && (
               <InputGroup.Button onClick={onSaveClick}>
                  <Icon icon="check" />
               </InputGroup.Button>
            )}
         </InputGroup>
      </div>
   );
};

export default EditableInput;
