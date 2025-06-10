import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Image, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Text } from '../../components/Text';
import { DetailedWordDTO, WordForm, WordDialect, WordDefinition } from '../types';
import { WordsService } from '../lib/services/words.service';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useColorScheme } from '@/hooks/useColorScheme';

// Import local flag images
const lbFlag = require('../../assets/images/flags/lb.png');
const saFlag = require('../../assets/images/flags/sa.png');
const egFlag = require('../../assets/images/flags/eg.png');

// Flag mapping for dialects
const FLAG_MAPPING = {
  'lb': lbFlag,
  'sa': saFlag,
  'eg': egFlag,
} as const;

const DIALECT_TO_COUNTRY_CODE: Record<WordDialect, keyof typeof FLAG_MAPPING> = {
  'lb': 'lb',
  'sa': 'sa',
  'eg': 'eg',
};

const DIALECT_NAME_TO_CODE: Record<string, WordDialect> = {
  "Lebanese Arabic": "lb",
  "Formal Arabic": "sa",
  "Egyptian Arabic": "eg"
};

const FrequencyTag = ({ tag }: { tag: string }) => (
  <View className="bg-gray-100 rounded-md px-2 py-1 mr-2">
    <Text className="text-sm text-gray-600">{tag}</Text>
  </View>
);

const DialectFlag = ({ dialect }: { dialect: WordDialect }) => {
  const countryCode = DIALECT_TO_COUNTRY_CODE[dialect];
  return (
    <Image
      source={FLAG_MAPPING[countryCode]}
      className="w-5 h-3 mx-0.5"
    />
  );
};

const WordFormRow = ({ form }: { form: WordForm }) => (
  <View className="flex-row items-center py-3 border-b border-gray-200">
    <View className="flex-1">
      <Text className="text-xl font-arabic">{form.arabic_script}</Text>
      <Text className="text-gray-600">{form.transliteration}</Text>
    </View>
    <View className="flex-row items-center">
      <Text className="text-gray-600 mr-2">{form.conjugation}</Text>
      {/* Show dialect flag and label */}
      <DialectFlag dialect={form.dialect} />
      <Text className="text-gray-600 ml-1 mr-2">{form.dialect}</Text>
      {/* Audio button placeholder for future implementation */}
      <View className="w-8 h-8 bg-gray-200 rounded-full" />
    </View>
  </View>
);

export default function WordDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [word, setWord] = useState<DetailedWordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useColorScheme() ?? 'light';


  useEffect(() => {
    loadWordDetails();
  }, [id]);

  const loadWordDetails = async () => {
    try {
      const details = await WordsService.getWordDetails(id as string);
      setWord(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load word details');
    } finally {
      setLoading(false);
    }
  };

  // Customize the header
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: word ? word.english_term : 'Loading...',
          headerBackTitle: 'Back'
        }} 
      />
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : error || !word ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500">{error || 'Word not found'}</Text>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView className="flex-1 bg-white p-4">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-arabic mb-2">{word.primary_arabic_script}</Text>
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-600">({word.part_of_speech}) - </Text>
                <Text className="text-gray-800">{word.english_term}</Text>
              </View>
              <View className="flex-row flex-wrap">
                {word.frequency_tags.map((tag: string, index: number) => (
                  <FrequencyTag key={index} tag={tag} />
                ))}
              </View>
              <View className="flex-row mt-2">
                {word.usage_regions.map((region: WordDialect, index: number) => (
                  <DialectFlag key={index} dialect={region} />
                ))}
              </View>
            </View>

            {/* Definitions */}
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-3">Definitions</Text>
              {word.definitions.map((def: WordDefinition, index: number) => (
                <View key={index} className="mb-4">
                  <Text className="text-lg mb-1">{index + 1}. {def.definition}</Text>
                  {def.example && (
                    <Text className="text-gray-600 ml-4">e.g., {def.example}</Text>
                  )}
                  {def.usage_notes && (
                    <Text className="text-gray-500 ml-4 mt-1">{def.usage_notes}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Forms */}
            <View>
              <Text className="text-xl font-semibold mb-3">Forms</Text>
              <View className="bg-gray-50 rounded-lg p-4">
                {word.forms.map((form: WordForm, index: number) => (
                  <WordFormRow key={index} form={form} />
                ))}
              </View>
            </View>

            {/* Educational Notes */}
            {word.educational_notes && word.educational_notes.length > 0 && (
              <View className="mt-6">
                <Text className="text-xl font-semibold mb-3">Notes</Text>
                {word.educational_notes.map((note: string, index: number) => (
                  <Text key={index} className="text-gray-600 mb-2">• {note}</Text>
                ))}
              </View>
            )}
          </ScrollView>
          
          <Pressable
            onPress={() => router.back()}
            className="absolute bottom-6 right-2 bg-gray-800 px-6 py-3 rounded-full shadow-lg"
          ><Text className="text-white">
            <IconSymbol
              name="chevron.left"
              size={18}
              weight="medium"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </Text>
          </Pressable>
        </View>
      )}
    </>
  );
} 