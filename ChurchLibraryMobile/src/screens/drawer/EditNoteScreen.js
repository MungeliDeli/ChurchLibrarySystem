import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import { updateAnnotation } from '../../services/annotationService';

export default function EditNoteScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { annotationId, note: initialNote, isNote } = route.params;
    
    const [note, setNote] = useState(initialNote);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!note.trim()) {
            ToastAndroid.show("Note cannot be empty.", ToastAndroid.SHORT);
            return;
        }
        setIsSaving(true);
        try {
            await updateAnnotation(annotationId, note, isNote);
            ToastAndroid.show("Note updated successfully", ToastAndroid.SHORT);
            navigation.goBack();
        } catch (error) {
            ToastAndroid.show("Failed to update note", ToastAndroid.SHORT);
        } finally {
            setIsSaving(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
            padding: 20,
        },
        input: {
            flex: 1,
            backgroundColor: theme.colors.background.paper,
            color: theme.colors.text.primary,
            textAlignVertical: 'top',
            padding: 15,
            fontSize: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        saveButton: {
            backgroundColor: theme.colors.primary.main,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
        },
        saveButtonText: {
            color: theme.colors.text.button,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="Edit your note..."
                placeholderTextColor={theme.colors.text.secondary}
                multiline
                autoFocus
            />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isSaving}>
                <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Note'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
