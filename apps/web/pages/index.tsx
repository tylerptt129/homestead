import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';

const COLORS = {
  base: '#1C1A17',
  surface: '#2A2520',
  surfaceAlt: '#352F28',
  card: '#3D362E',
  primary: '#C8A96E',
  primaryMuted: '#9B8455',
  accent: '#5B8C5A',
  accentAlt: '#7FB069',
  danger: '#C75D3A',
  warning: '#D4A437',
  text: '#E8E0D4',
  textMuted: '#9C9284',
  border: '#4A4238',
};

function HeroSection() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroOverlay}>
        <Text style={styles.heroTagline}>Plan your land. Build your life. Track every step.</Text>
        <Text style={styles.heroTitle}>Homestead Forge</Text>
        <Text style={styles.heroDescription}>
          The all-in-one homestead planning companion that guides you from raw land to
          self-sufficiency. Track progress, manage budgets, journal your journey — online or off.
        </Text>
        <View style={styles.heroButtons}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Download for iOS</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Download for Android</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: COLORS.accent }]}>
            <Text style={[styles.secondaryButtonText, { color: COLORS.accent }]}>
              Open Web App
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: '🗺️',
      title: '12 Guided Modules',
      description:
        'From land assessment to community building — structured, step-by-step paths for every aspect of homesteading.',
    },
    {
      icon: '📍',
      title: 'Step-by-Step Tracking',
      description:
        'Visual trail markers guide your progress. See dependencies, track completion, and always know what comes next.',
    },
    {
      icon: '💾',
      title: 'Autosave Everything',
      description:
        'No save buttons. Ever. Your data is persisted locally and synced to the cloud automatically. Crash-proof.',
    },
    {
      icon: '📡',
      title: 'Offline-First',
      description:
        'Full functionality without internet. Changes sync when you reconnect. Built for rural life.',
    },
    {
      icon: '💰',
      title: 'Budget Intelligence',
      description:
        'Track expenses per module, compare actual vs. estimated costs, and see where every dollar goes.',
    },
    {
      icon: '📓',
      title: 'Photo Journal',
      description:
        'Document your journey with photos, notes, mood tracking, and weather data. Your homestead story, captured.',
    },
    {
      icon: '🌿',
      title: 'Seasonal Calendar',
      description:
        'Climate-zone-aware task reminders. Know what to plant, build, and prepare — every month of the year.',
    },
    {
      icon: '📊',
      title: 'Export & Share',
      description:
        'Export your progress as PDF, budget as CSV, or full backup as JSON. Your data is always yours.',
    },
  ];

  return (
    <View style={styles.featuresSection}>
      <Text style={styles.sectionTitle}>Everything You Need, Nothing You Don't</Text>
      <Text style={styles.sectionSubtitle}>
        Built by homesteaders, for homesteaders. One app replaces the spreadsheets, notebooks, and
        half-dozen apps you're juggling now.
      </Text>
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </View>
    </View>
  );
}

function ModuleCard({ title, steps, color }: { title: string; steps: number; color: string }) {
  return (
    <View style={[styles.moduleCard, { borderLeftColor: color }]}>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleSteps}>{steps} guided steps</Text>
    </View>
  );
}

function ModulesSection() {
  const modules = [
    { title: 'Land Assessment & Site Planning', steps: 10, color: '#8B7355' },
    { title: 'Water Systems', steps: 10, color: '#4A90D9' },
    { title: 'Shelter & Structures', steps: 10, color: '#A0522D' },
    { title: 'Power & Energy', steps: 10, color: '#DAA520' },
    { title: 'Food Production — Garden', steps: 10, color: '#228B22' },
    { title: 'Orchard & Perennials', steps: 10, color: '#6B8E23' },
    { title: 'Livestock & Animals', steps: 10, color: '#CD853F' },
    { title: 'Food Preservation & Storage', steps: 10, color: '#8B4513' },
    { title: 'Tools, Equipment & Workshop', steps: 10, color: '#708090' },
    { title: 'Security & Safety', steps: 10, color: '#B22222' },
    { title: 'Financial Planning', steps: 10, color: '#2E8B57' },
    { title: 'Community & Skills', steps: 10, color: '#9370DB' },
  ];

  return (
    <View style={styles.modulesSection}>
      <Text style={styles.sectionTitle}>12 Comprehensive Modules</Text>
      <Text style={styles.sectionSubtitle}>
        Each module contains detailed, actionable steps with cost estimates, time expectations, pro
        tips, and seasonal guidance.
      </Text>
      <View style={styles.modulesGrid}>
        {modules.map((mod, index) => (
          <ModuleCard key={index} {...mod} />
        ))}
      </View>
    </View>
  );
}

function TestimonialSection() {
  return (
    <View style={styles.testimonialSection}>
      <Text style={styles.sectionTitle}>Built for Real Homesteaders</Text>
      <View style={styles.painPoints}>
        <View style={styles.painPointCard}>
          <Text style={styles.painPointQuote}>
            "I had 6 different apps, 3 spreadsheets, and a notebook. Now I have one app."
          </Text>
        </View>
        <View style={styles.painPointCard}>
          <Text style={styles.painPointQuote}>
            "Finally an app that works when I'm out on the property with no signal."
          </Text>
        </View>
        <View style={styles.painPointCard}>
          <Text style={styles.painPointQuote}>
            "The step-by-step guidance is like having a mentor walking the land with you."
          </Text>
        </View>
      </View>
    </View>
  );
}

function FooterSection() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLogo}>Homestead Forge</Text>
      <Text style={styles.footerTagline}>Plan your land. Build your life. Track every step.</Text>
      <View style={styles.footerLinks}>
        <Pressable>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Pressable>
        <Text style={styles.footerDivider}>|</Text>
        <Pressable>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </Pressable>
        <Text style={styles.footerDivider}>|</Text>
        <Pressable>
          <Text style={styles.footerLink}>Support</Text>
        </Pressable>
      </View>
      <Text style={styles.footerCopy}>
        &copy; {new Date().getFullYear()} Homestead Forge. Apache 2.0 License.
      </Text>
    </View>
  );
}

export default function LandingPage() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
      <TestimonialSection />
      <FooterSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.base,
  },
  contentContainer: {
    minHeight: '100%',
  },

  // Hero
  hero: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heroOverlay: {
    maxWidth: 800,
    alignItems: 'center',
  },
  heroTagline: {
    fontFamily: 'Caveat',
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -1,
  },
  heroDescription: {
    fontFamily: 'Source Sans 3',
    fontSize: 20,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
    maxWidth: 600,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.base,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Features
  featuresSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: 'Source Sans 3',
    fontSize: 18,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 28,
    marginBottom: 48,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    maxWidth: 1100,
  },
  featureCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 28,
    width: 250,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: 'rgba(28,26,23,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: 'Source Sans 3',
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 24,
  },

  // Modules
  modulesSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 900,
  },
  moduleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: 260,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moduleTitle: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  moduleSteps: {
    fontFamily: 'JetBrains Mono',
    fontSize: 13,
    color: COLORS.textMuted,
  },

  // Testimonials
  testimonialSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  painPoints: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
    maxWidth: 1000,
    marginTop: 32,
  },
  painPointCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 28,
    width: 300,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  painPointQuote: {
    fontFamily: 'Caveat',
    fontSize: 20,
    color: COLORS.text,
    lineHeight: 30,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerLogo: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  footerTagline: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  footerLink: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  footerDivider: {
    color: COLORS.border,
    fontSize: 14,
  },
  footerCopy: {
    fontFamily: 'Source Sans 3',
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
