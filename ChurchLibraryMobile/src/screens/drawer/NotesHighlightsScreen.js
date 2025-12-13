import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { getUserAnnotations, deleteAnnotation } from '../../services/annotationService';

export default function NotesHighlightsScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnnotations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserAnnotations();
            setAnnotations(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAnnotations();
        }, [fetchAnnotations])
    );

    const handleAnnotationPress = (item) => {
        console.log('Navigating to annotation at location:', item.textLocation);
        if (item.LibraryItem && item.LibraryItem.fileUrl) {
            navigation.navigate('Library', {
                screen: 'BookReader',
                params: {
                    itemId: item.itemId,
                    downloadUrl: item.LibraryItem.fileUrl,
                    location: item.textLocation,
                },
            });
        }
    };
    
    const handleDelete = (annotationId) => {
        Alert.alert(
            "Delete Annotation",
            "Are you sure you want to delete this annotation?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", 
                    onPress: async () => {
                        try {
                            await deleteAnnotation(annotationId);
                            setAnnotations(prev => prev.filter(item => item.annotationId !== annotationId));
                            ToastAndroid.show("Annotation deleted", ToastAndroid.SHORT);
                        } catch (err) {
                            ToastAndroid.show("Failed to delete annotation", ToastAndroid.SHORT);
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = (item) => {
        navigation.navigate('EditNote', { annotationId: item.annotationId, note: item.note, isNote: item.isNote });
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorText: {
            color: theme.colors.text.danger,
            fontSize: 16,
        },
        emptyText: {
            color: theme.colors.text.secondary,
            fontSize: 16,
        },
        itemContainer: {
            backgroundColor: theme.colors.background.paper,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
        },
        itemTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            flex: 1, // Take available space
        },
        itemAuthor: {
            fontSize: 14,
            color: theme.colors.text.secondary,
            marginBottom: 5,
        },
        highlightText: {
            fontSize: 14,
            color: theme.colors.text.primary,
            fontStyle: 'italic',
            marginBottom: 10,
        },
        actionsContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 10,
        },
        actionButton: {
            marginLeft: 15,
            padding: 5,
        }
    });

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleAnnotationPress(item)}>
                {item.LibraryItem && (
                    <>
                        <Text style={styles.itemTitle}>{item.LibraryItem.title}</Text>
                        <Text style={styles.itemAuthor}>{item.LibraryItem.authors.join(', ')}</Text>
                    </>
                )}
                <Text style={styles.highlightText}>"{item.note}"</Text>
            </TouchableOpacity>
            <View style={styles.actionsContainer}>
                {item.isNote && (
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                        <MaterialIcons name="edit" size={22} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(item.annotationId)} style={styles.actionButton}>
                    <MaterialIcons name="delete" size={22} color={theme.colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={annotations}
                renderItem={renderItem}
                keyExtractor={(item) => item.annotationId}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>You don't have any notes or highlights yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}