import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  const images = [
    require('../assets/images/undraw_pin-to-board_eoie.png'),
    require('../assets/images/undraw_teacher_s628.png'),
    require('../assets/images/undraw_to-do-list_eoia.png')
  ];
  const fadeDuration = 1000;
  const holdDuration = 2000;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Image carousel animation with 1s fade + 2s hold per image
    Animated.loop(
      Animated.sequence([
        Animated.delay(holdDuration),
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: fadeDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(holdDuration),
        Animated.timing(imageAnim, {
          toValue: 2,
          duration: fadeDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(holdDuration),
        Animated.timing(imageAnim, {
          toValue: 0,
          duration: fadeDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [fadeAnim, imageAnim, slideUpAnim]);

  const getImageStyle = (index) => {
    const opacity = imageAnim.interpolate({
      inputRange: images.map((_, i) => i),
      outputRange: images.map((_, i) => (i === index ? 1 : 0)),
      extrapolate: 'clamp'
    });

    return {
      ...styles.illustration,
      opacity,
      position: 'absolute'
    };
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F5F7FA']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Animated Image Carousel */}
        <Animated.View style={[styles.illustrationContainer, { transform: [{ translateY: slideUpAnim }] }]}>
          {images.map((img, index) => (
            <Animated.Image
              key={index}
              source={img}
              style={[{ ...getImageStyle(index), position: 'absolute' }]}
              resizeMode="contain"
            />
          ))}
        </Animated.View>

        {/* Rest of your content */}
        <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>LottieCraft</Text>
        </Animated.View>
        
        <Animated.View style={[styles.divider, { transform: [{ translateY: slideUpAnim }] }]} />
        
        <Animated.Text style={[styles.subtitle, { transform: [{ translateY: slideUpAnim }] }]}>
          Transform your teaching materials with AI-powered lesson notes
        </Animated.Text>
        
        <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
          <Link href="/generator" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Generating Notes</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </Link>
        </Animated.View>
        
        <Animated.View style={[styles.featuresContainer, { transform: [{ translateY: slideUpAnim }] }]}>
          <View style={styles.featureItem}>
            <Ionicons name="bulb-outline" size={24} color="#6366F1" />
            <Text style={styles.featureText}>AI-Powered</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={24} color="#6366F1" />
            <Text style={styles.featureText}>Save Time</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="school-outline" size={24} color="#6366F1" />
            <Text style={styles.featureText}>Reliable</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 2,
  },
  content: {
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 10,
    width: 200,
    height: 200,
    position: 'relative',
  },
  illustration: {
    width: 180,
    height: 180,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '300',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: -5,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: 'rgba(99, 102, 241, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  divider: {
    width: 80,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 300,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    marginTop: 10,
  },
  featureItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 100,
  },
  featureText: {
    color: '#475569',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
