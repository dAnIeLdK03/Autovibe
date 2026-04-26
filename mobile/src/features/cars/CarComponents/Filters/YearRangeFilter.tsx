import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface YearRangeProps {
    value: { min: string, max: string };
    onFilterChange: (range: { min: string; max: string }) => void;
}

export const YearRangeFilter = ({ value, onFilterChange }: YearRangeProps) => {
    const minLimit = 1900;
    const maxLimit = new Date().getFullYear();

    const isFiltered = value.min !== "" || value.max !== "";
    const showReset = isFiltered;

    const currentRange: [number, number] = [
        value.min ? parseInt(value.min) : minLimit,
        value.max ? parseInt(value.max) : maxLimit,
    ];

    const handleUpdate = (val: number | number[]) => {
        if (Array.isArray(val)) {
            onFilterChange({
                min: val[0].toString(),
                max: val[1].toString()
            });
        }
    };
    const { width } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Year Range</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {currentRange[0]} - {currentRange[1]}
                    </Text>
                </View>
            </View>

            <View style={styles.sliderWrapper}>
                <MultiSlider
                    values={[currentRange[0], currentRange[1]]}
                    sliderLength={width - 100}
                    onValuesChangeFinish={handleUpdate}
                    min={minLimit}
                    max={maxLimit}
                    step={1}
                    allowOverlap={false}
                    snapped
                    selectedStyle={{ backgroundColor: '#70FFE2' }}
                    unselectedStyle={{ backgroundColor: '#1e293b' }}
                    markerStyle={styles.marker}
                    pressedMarkerStyle={styles.markerPressed}
                    trackStyle={{ height: 4 }}
                />

                {showReset && (
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => onFilterChange({ min: "", max: "" })}
                    >
                        <Text style={styles.resetText}>RESET</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minWidth: 240,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: '700',
        color: '#64748b',
    },
    badge: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        color: '#70FFE2',
    },
    sliderWrapper: {
        alignItems: 'center',
        gap: 15,
    },
    marker: {
        backgroundColor: '#0f172a',
        borderColor: '#70FFE2',
        borderWidth: 2,
        height: 20,
        width: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 3,
    },
    markerPressed: {
        height: 24,
        width: 24,
        backgroundColor: '#70FFE2',
    },
    resetButton: {
        marginTop: 10,
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: '#1e293b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    resetText: {
        color: '#70FFE2',
        fontSize: 12,
        fontWeight: '700',
    }
});
