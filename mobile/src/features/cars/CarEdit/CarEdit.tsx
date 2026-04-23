import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormProvider } from 'react-hook-form';
import CarForm from '../CarComponents/CarForm'; 
import { useCarEdit } from './useCarEdit';

export function CarCreate() {
  const {
    methods, 
    imagePreview, 
    handleImageChange, 
    onSubmit,
    removeImage
  } = useCarEdit();

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <CarForm 
          handleImageChange={handleImageChange} 
          imagePreview={imagePreview} 
          submitLabel='Create' 
          title='Create Ad' 
          onRemoveImage={removeImage}
          onFormSubmit={methods.handleSubmit(onSubmit)}
        />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

export default CarCreate;