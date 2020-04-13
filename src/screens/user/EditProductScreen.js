import React, { useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import HeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/products";

const UPDATE_INPUT_FORM = "UPDATE";
const formReducer = (state, action) => {
  if (action.type === UPDATE_INPUT_FORM) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedIsFormValid = true;
    for (const key in updatedInputValidities) {
      updatedIsFormValid = updatedIsFormValid && updatedInputValidities[key];
    }
    return {
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formValidation: updatedIsFormValid,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formValidation: editedProduct ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!formState.formValidation) {
      Alert.alert("Error", "Please check the errors in the form", [
        { text: "Ok" },
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productsActions.createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputTextHandler = useCallback((inputId, text, isValid) => {
    dispatchFormState({
      type: UPDATE_INPUT_FORM,
      value: text,
      isValid: isValid,
      input: inputId,
    });
  }, [dispatchFormState]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="title"
          label="Title"
          errorMessage="Please enter a valid title!"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          keyboardType="default"
          onInputChange={inputTextHandler}
          initialValue={editedProduct ? editedProduct.title : ''}
          initiallyValid={!!editedProduct}
          required
        />
        <Input
          id="imageUrl"
          label="Image URL"
          errorMessage="Please enter a valid url!"
          returnKeyType="next"
          keyboardType="url"
          onInputChange={inputTextHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ''}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct ? null : (
          <Input
          id="price"
          label="Price"
          errorMessage="Please enter a valid price!"
          returnKeyType="next"
          keyboardType="decimal-pad"
          onInputChange={inputTextHandler}
          initialValue={editedProduct ? editedProduct.price : ''}
          initiallyValid={!!editedProduct}
          required
          min={0.1}
        />
        )}
        <Input
          id="description"
          label="Description"
          errorMessage="Please enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputTextHandler}
          initialValue={editedProduct ? editedProduct.description : ''}
          initiallyValid={!!editedProduct}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  }
});

export default EditProductScreen;
