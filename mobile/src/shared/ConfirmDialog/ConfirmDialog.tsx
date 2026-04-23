import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Pressable 
} from 'react-native';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirmClick: () => void;
    onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirmClick,
    onClose
}) => {
    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.confirmButton} 
                            onPress={() => {
                                onConfirmClick();
                                onClose(); 
                            }}
                        >
                            <Text style={styles.confirmText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>

            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 350,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10, 
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        gap: 12,
    },
    confirmButton: {
        backgroundColor: '#334155',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#64748b',
        fontSize: 14,
    }
});

export default ConfirmDialog;