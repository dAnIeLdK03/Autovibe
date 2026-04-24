import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../shared/UX/EmptyState";
import { SkeletonLoader } from "../../../shared/UX/SkeletonLoading";
import { useMyCars } from "./useMyCars";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import CarCard from "../CarComponents/CarCard";
import Pagination from "../../../shared/Pagination/pagePagination";
import ConfirmDialog from "../../../shared/ConfirmDialog/ConfirmDialog";
import { StyleSheet } from 'react-native';

export function MyCars() {

    const {
        cars, loading, error, page, totalPages, setPage,
        showDeleteConfirm, handleDeletePress, handleCancelDelete,
        handleConfirmDelete
    } = useMyCars();


    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <SkeletonLoader type="details" count={3} />
            </View>
        );
    }
    if (cars.length === 0) {
        <EmptyState />
    }

    if (!loading && !error && cars.length === 0) {
        return (
            <EmptyState />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>
                            My <Text style={styles.highlight}>Cars</Text>
                        </Text>
                        <Text style={styles.subtitle}>
                            Manage your listings ({cars.length} {cars.length === 1 ? "ad" : "ads"})
                        </Text>
                    </View>
                </View>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {loading && cars.length === 0 ? (
                    <ActivityIndicator size="large" color="#70FFE2" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.grid}>
                        {cars.map((car) => (
                            <CarCard
                                key={car.id}
                                car={car}
                                onDeleteClick={() => handleDeletePress(car.id)}
                                showDeletebutton={true}
                            />
                        ))}
                    </View>
                )}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage: number) => {
                            setPage(newPage);
                        }}
                    />
                )}
            </ScrollView>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Car"
                message="Are you sure you want to delete this car?"
                onConfirmClick={handleConfirmDelete}
                onClose={handleCancelDelete}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -1,
    },
    highlight: {
        color: '#70FFE2',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        marginTop: 4,
    },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: '#ef4444',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
    },
    grid: {
        gap: 20,
    },
});
