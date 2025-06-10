import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView, Image, Pressable, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { WordDTO, WordsResponse } from '../types';
import { Input } from "../../components/Input";
import { Text } from "../../components/Text";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { AuthService } from '../lib/services/auth.service';
import { WordsService } from '../lib/services/words.service';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Import flag images
const lbFlag = require('../../assets/images/flags/lb.png');
const saFlag = require('../../assets/images/flags/sa.png');
const egFlag = require('../../assets/images/flags/eg.png');

// Flag mapping
const FLAG_MAPPING = {
  'lb': lbFlag,
  'sa': saFlag,
  'eg': egFlag,
} as const;

const WordItem = ({ word }: { word: WordDTO }) => {
  const router = useRouter();
  
  return (
    <Pressable 
      onPress={() => router.push(`/word/${word.id}`)}
      className="flex-row items-center py-3 border-b border-gray-200 active:bg-gray-50"
    >
      <View className="flex-1">
        <Text className="text-2xl mb-1 font-arabic">{word.primary_arabic_script}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-600">({word.part_of_speech}) - </Text>
          <Text className="text-gray-800">{word.english_term}</Text>
          <View className="flex-row ml-2">
            {word.dialects?.map((dialect) => (
              <Image 
                key={dialect.country_code}
                source={FLAG_MAPPING[dialect.country_code as keyof typeof FLAG_MAPPING]}
                className="w-5 h-3 mx-0.5"
              />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function WordsScreen() {
  const [data, setData] = useState<WordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Move content up by 150 units when keyboard shows
        translateY.value = withTiming(-150, { duration: 300 });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Reset position when keyboard hides
        translateY.value = withTiming(0, { duration: 300 });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const response = await WordsService.getWords({});
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const searchWords = async (query: string) => {
    try {
      const isArabic = /[\u0600-\u06FF]/.test(query);
      const response = await WordsService.getWords({
        ...(isArabic ? { arabic: query } : { english: query })
      });
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  async function onChangeText(text: string) {
    setSearchQuery(text);
    if (searchError) {
      setSearchError(null);
    }
    
    if (text.length >= 2) {
      await searchWords(text);
    } else if (text.length === 0) {
      await loadWords();
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const resetSearch = async () => {
    setSearchQuery('');
    await loadWords();
    if (inputRef.current) {
      inputRef.current.blur();
    }
    Keyboard.dismiss();
  };

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1">
        <Animated.View 
          style={[{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white' }, animatedStyle]}
        >
          <ScrollView 
            className="max-h-96 px-4"
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View className="py-8 justify-center items-center">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              data?.data.map((word: WordDTO) => (
                <WordItem key={word.id} word={word} />
              ))
            )}
          </ScrollView>
          
          <View className="mt-5 mx-5 mb-36 bg-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <View className="flex-row items-center">
              <Input
                ref={inputRef}
                placeholder="Enter an Arabic or English word"
                value={searchQuery}
                onChangeText={onChangeText}
                aria-labelledby="searchLabel"
                aria-errormessage="searchError"
                className="text-xl flex-1"
              />
              {searchQuery.length > 0 && (
                <Pressable 
                  onPress={resetSearch}
                  className="ml-2 p-2 rounded-full active:bg-gray-200"
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </Pressable>
              )}
            </View>
            {searchError && <ErrorMessage msg={searchError} />}
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

function ErrorMessage({ msg }: { msg: string }) {
  if (Platform.OS === "web") {
    return (
      <Text
        className="text-destructive text-sm native:px-1 py-1.5 web:animate-in web:zoom-in-95"
        aria-invalid="true"
        id="searchError"
      >
        {msg}
      </Text>
    );
  }
  return (
    <Animated.Text
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      className="text-destructive text-sm native:px-1 py-1.5"
      aria-invalid="true"
      id="searchError"
    >
      {msg}
    </Animated.Text>
  );
} 