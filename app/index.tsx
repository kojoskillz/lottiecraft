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
      colors={["#FFFFFF", "#F5F7FA"]}
      style={styles.container}
    >
      {/* Background accent gradients */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(99,102,241,0.18)", "rgba(99,102,241,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bgBlobTopLeft}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(16,185,129,0.12)", "rgba(16,185,129,0)"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.bgBlobBottomRight}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}> 
        {/* Animated Image Carousel */}
        <Animated.View style={[styles.illustrationContainer, { transform: [{ translateY: slideUpAnim }] }]}> 
          {/* Glowing hero orb behind the rotating illustrations */}
          <LinearGradient 
            colors={["rgba(99,102,241,0.25)", "rgba(99,102,241,0)"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.heroOrb}
          />
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
            <TouchableOpacity activeOpacity={0.9} style={styles.buttonOuter}>
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Start Generating Notes</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </Animated.View>
        
        <Animated.View style={[styles.featuresContainer, { transform: [{ translateY: slideUpAnim }] }]}> 
          <LinearGradient colors={["#EEF2FF", "#FFFFFF"]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.featureCardOuter}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="bulb-outline" size={16} color="#6366F1" />
              </View>
              <Text style={styles.featureTitle}>AI-Powered</Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={["#EEF2FF", "#FFFFFF"]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.featureCardOuter}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="time-outline" size={16} color="#6366F1" />
              </View>
              <Text style={styles.featureTitle}>Save Time</Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={["#EEF2FF", "#FFFFFF"]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.featureCardOuter}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="school-outline" size={16} color="#6366F1" />
              </View>
              <Text style={styles.featureTitle}>Reliable</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    alignItems: 'center',
  },
  bgBlobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  bgBlobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  illustrationContainer: {
    marginBottom: 16,
    width: 220,
    height: 220,
    position: 'relative',
  },
  illustration: {
    width: 196,
    height: 196,
    top: 6,
  },
  heroOrb: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    top: 18,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
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
    fontSize: 44,
    fontWeight: '800',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(99, 102, 241, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  divider: {
    width: 90,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 36,
    maxWidth: 340,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  buttonOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 36,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
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
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    marginTop: 6,
    marginBottom: 28,
  },
  featureCardOuter: {
    borderRadius: 14,
    padding: 1,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
