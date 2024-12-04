export function isClassificationOfType(classification, type) {
    return classification.type === type
}

export function isCustomClassification(classification) {
    return isClassificationOfType(classification, 'Custom')
}

export function isEscoClassification(classification) {
    return isClassificationOfType(classification, 'ESCO')
}

export function isWikipediaClassification(classification) {
    return isClassificationOfType(classification, 'Wikipedia')
}

export default {
    isClassificationOfType,
    isCustomClassification,
    isEscoClassification,
    isWikipediaClassification,
}
