import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import useTheme from '../../hooks/useTheme';

const NoteModal = ({ isVisible, onClose, onSave, selectedText }) => {
  const { theme } = useTheme();
  const [noteText, setNoteText] = useState('');

  const handleSave = () => {
    onSave(noteText);
    setNoteText('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>Add a Note</Text>
          <View style={[styles.selectedTextView, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.selectedText, { color: theme.colors.text.secondary }]} numberOfLines={3}>
              "{selectedText}"
            </Text>
          </View>
          <TextInput
            style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder="Type your note here..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            value={noteText}
            onChangeText={setNoteText}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel, { backgroundColor: theme.colors.background.secondary }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: theme.colors.text.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave, { backgroundColor: theme.colors.primary.main }]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  selectedTextView: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedText: {
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
  },
  buttonSave: {
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NoteModal;
