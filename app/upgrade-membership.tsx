import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useClub } from "@/lib/contexts/ClubContext";
import { useMembership } from "@/lib/hooks/useMembership";
import {
  TIER_CONFIG,
  TIER_ORDER,
  isUpgrade,
  isDowngrade,
  getLostBenefits,
  type MembershipTier,
  type TierConfig,
  type TierBenefit,
} from "@/lib/membership";
import { formatCLP } from "@/lib/mock-data";

type Step = 'select' | 'downgrade-warning' | 'payment' | 'processing' | 'success';

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

function TierCard({
  config,
  isCurrent,
  colors,
  actionLabel,
  onSelect,
  isLight,
}: {
  config: TierConfig;
  isCurrent: boolean;
  colors: Record<string, string>;
  actionLabel: string | null;
  onSelect: () => void;
  isLight: boolean;
}) {
  return (
    <View style={[styles.tierCard, { borderColor: isCurrent ? config.color + '60' : colors.cardBorder }]}>
      <LinearGradient colors={isLight ? config.lightGradientColors : config.gradientColors} style={styles.tierCardInner}>
        <View style={styles.tierCardHeader}>
          <View style={[styles.tierCardBadge, { backgroundColor: config.color + '20' }]}>
            <MaterialCommunityIcons name={config.icon as any} size={20} color={config.color} />
          </View>
          <View style={styles.tierCardTitleArea}>
            <Text style={[styles.tierCardName, { color: colors.text }]}>{config.displayName}</Text>
            <Text style={[styles.tierCardTagline, { color: colors.textSecondary }]}>{config.tagline}</Text>
          </View>
          {isCurrent && (
            <View style={[styles.currentBadge, { backgroundColor: config.color + '20' }]}>
              <Text style={[styles.currentBadgeText, { color: config.color }]}>Actual</Text>
            </View>
          )}
        </View>

        <Text style={[styles.tierCardPrice, { color: config.color }]}>
          {config.price > 0 ? formatCLP(config.price) + '/mes' : 'Gratis'}
        </Text>

        <View style={styles.tierBenefitsList}>
          {config.benefits.map((b, i) => (
            <View key={i} style={styles.tierBenefitRow}>
              <MaterialCommunityIcons name={b.icon as any} size={16} color={config.color} />
              <Text style={[styles.tierBenefitText, { color: colors.textSecondary }]}>{b.label}</Text>
            </View>
          ))}
        </View>

        {actionLabel && (
          <Pressable
            onPress={onSelect}
            style={({ pressed }) => [
              styles.tierSelectBtn,
              { backgroundColor: config.color, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.tierSelectBtnText}>{actionLabel}</Text>
          </Pressable>
        )}
      </LinearGradient>
    </View>
  );
}

function StepSelect({
  currentTier,
  colors,
  onSelectTier,
  isLight,
}: {
  currentTier: MembershipTier;
  colors: Record<string, string>;
  onSelectTier: (tier: MembershipTier) => void;
  isLight: boolean;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.stepTitle, { color: colors.text }]}>Elige tu plan</Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Selecciona el plan que mejor se ajuste a ti
      </Text>

      {TIER_ORDER.map((tierId) => {
        const config = TIER_CONFIG[tierId];
        const isCurrent = tierId === currentTier;

        let actionLabel: string | null = null;
        if (!isCurrent) {
          if (isUpgrade(currentTier, tierId)) {
            actionLabel = 'Suscribirme';
          } else if (isDowngrade(currentTier, tierId)) {
            actionLabel = 'Cambiar a este plan';
          }
        }

        return (
          <TierCard
            key={tierId}
            config={config}
            isCurrent={isCurrent}
            colors={colors}
            actionLabel={actionLabel}
            onSelect={() => onSelectTier(tierId)}
            isLight={isLight}
          />
        );
      })}
    </ScrollView>
  );
}

function StepDowngradeWarning({
  fromConfig,
  toConfig,
  lostBenefits,
  colors,
  onConfirm,
  onBack,
}: {
  fromConfig: TierConfig;
  toConfig: TierConfig;
  lostBenefits: TierBenefit[];
  colors: Record<string, string>;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={onBack} style={styles.backRow}>
        <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        <Text style={[styles.backText, { color: colors.textSecondary }]}>Volver</Text>
      </Pressable>

      <View style={[styles.warningHeader, { backgroundColor: Colors.warning + '15' }]}>
        <Ionicons name="warning" size={28} color={Colors.warning} />
        <Text style={[styles.warningTitle, { color: colors.text }]}>
          ¿Cambiar de {fromConfig.displayName} a {toConfig.displayName}?
        </Text>
      </View>

      <Text style={[styles.warningDescription, { color: colors.textSecondary }]}>
        Al cambiar tu plan perderás acceso a los siguientes beneficios:
      </Text>

      <View style={[styles.lostBenefitsCard, { backgroundColor: colors.surface }]}>
        {lostBenefits.map((b, i) => (
          <View key={i} style={styles.lostBenefitRow}>
            <Ionicons name="close-circle" size={18} color={Colors.error} />
            <Text style={[styles.lostBenefitText, { color: colors.textSecondary }]}>{b.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.warningPriceCompare}>
        <View style={[styles.priceBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.priceBoxLabel, { color: colors.textTertiary }]}>Actual</Text>
          <Text style={[styles.priceBoxValue, { color: fromConfig.color }]}>{fromConfig.priceLabel}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color={colors.textTertiary} />
        <View style={[styles.priceBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.priceBoxLabel, { color: colors.textTertiary }]}>Nuevo</Text>
          <Text style={[styles.priceBoxValue, { color: toConfig.color }]}>{toConfig.priceLabel}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onConfirm();
        }}
        style={({ pressed }) => [
          styles.confirmDowngradeBtn,
          { backgroundColor: Colors.warning, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.confirmDowngradeBtnText}>Confirmar cambio de plan</Text>
      </Pressable>

      <Pressable onPress={onBack} style={styles.keepPlanBtn}>
        <Text style={[styles.keepPlanBtnText, { color: fromConfig.color }]}>
          Mantener Plan {fromConfig.name}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function StepPayment({
  selectedTier,
  colors,
  onPay,
  onBack,
}: {
  selectedTier: TierConfig;
  colors: Record<string, string>;
  onPay: () => void;
  onBack: () => void;
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const isValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvc.length === 3 &&
    name.length > 2;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.stepContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Volver</Text>
        </Pressable>

        <Text style={[styles.stepTitle, { color: colors.text }]}>Datos de pago</Text>
        <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
          Suscripción al Plan {selectedTier.name} — {selectedTier.priceLabel}
        </Text>

        <View style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.selectedTierRow, { backgroundColor: selectedTier.color + '15' }]}>
            <MaterialCommunityIcons name={selectedTier.icon as any} size={20} color={selectedTier.color} />
            <Text style={[styles.selectedTierName, { color: selectedTier.color }]}>{selectedTier.displayName}</Text>
            <Text style={[styles.selectedTierPrice, { color: colors.textSecondary }]}>{selectedTier.priceLabel}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>Número de tarjeta</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surfaceLight }]}
              value={cardNumber}
              onChangeText={(v) => setCardNumber(formatCardNumber(v))}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={19}
            />
          </View>

          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>Vencimiento</Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surfaceLight }]}
                value={expiry}
                onChangeText={(v) => setExpiry(formatExpiry(v))}
                placeholder="MM/AA"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>CVC</Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surfaceLight }]}
                value={cvc}
                onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>Nombre del titular</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.surfaceLight }]}
              value={name}
              onChangeText={setName}
              placeholder="Como aparece en la tarjeta"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (!isValid) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPay();
          }}
          style={({ pressed }) => [
            styles.payBtn,
            {
              backgroundColor: isValid ? selectedTier.color : colors.surfaceHighlight,
              opacity: pressed && isValid ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.payBtnText, { color: isValid ? '#000' : colors.textTertiary }]}>
            Pagar {selectedTier.priceLabel}
          </Text>
        </Pressable>

        <View style={styles.securityRow}>
          <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
          <Text style={[styles.securityText, { color: colors.textTertiary }]}>
            Pago seguro. Tu información está protegida.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StepProcessing({ colors, tierConfig }: { colors: Record<string, string>; tierConfig: TierConfig }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.centeredStep}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <MaterialCommunityIcons name="loading" size={48} color={tierConfig.color} />
      </Animated.View>
      <Text style={[styles.processingTitle, { color: colors.text }]}>Procesando cambio...</Text>
      <Text style={[styles.processingSubtitle, { color: colors.textSecondary }]}>
        Esto solo tomará un momento
      </Text>
    </View>
  );
}

function StepSuccess({
  tierConfig,
  colors,
  onDone,
}: {
  tierConfig: TierConfig;
  colors: Record<string, string>;
  onDone: () => void;
}) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <View style={styles.centeredStep}>
      <Animated.View
        style={[
          styles.successCircle,
          { backgroundColor: tierConfig.color + '20', transform: [{ scale }] },
        ]}
      >
        <Ionicons name="checkmark-circle" size={72} color={tierConfig.color} />
      </Animated.View>
      <Text style={[styles.successTitle, { color: colors.text }]}>
        ¡Bienvenido al Plan {tierConfig.name}!
      </Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
        Tu membresía ha sido actualizada exitosamente. Ya puedes disfrutar de todos tus beneficios.
      </Text>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onDone();
        }}
        style={({ pressed }) => [
          styles.successBtn,
          { backgroundColor: tierConfig.color, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <MaterialCommunityIcons name="card-account-details" size={20} color="#000" />
        <Text style={styles.successBtnText}>Ver mi carnet</Text>
      </Pressable>
    </View>
  );
}

export default function UpgradeMembershipScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { theme, themeMode } = useClub();
  const colors = theme.colors;
  const isLight = themeMode === 'light';
  const { tier, tierConfig: currentConfig, upgradeTo } = useMembership();

  const [step, setStep] = useState<Step>('select');
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  const selectedConfig = selectedTier ? TIER_CONFIG[selectedTier] : null;
  const lostBenefits = selectedTier ? getLostBenefits(tier, selectedTier) : [];

  const handleSelectTier = (tierId: MembershipTier) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTier(tierId);

    if (isDowngrade(tier, tierId)) {
      setStep('downgrade-warning');
    } else {
      setStep('payment');
    }
  };

  const handleConfirmDowngrade = () => {
    setStep('processing');
    setTimeout(async () => {
      if (selectedTier) {
        await upgradeTo(selectedTier);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('success');
    }, 2000);
  };

  const handlePay = () => {
    setStep('processing');
    setTimeout(async () => {
      if (selectedTier) {
        await upgradeTo(selectedTier);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('success');
    }, 2000);
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        {(step === 'select' || step === 'payment' || step === 'downgrade-warning') && (
          <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        )}
      </View>

      {step === 'select' && (
        <StepSelect
          currentTier={tier}
          colors={colors}
          onSelectTier={handleSelectTier}
          isLight={isLight}
        />
      )}

      {step === 'downgrade-warning' && selectedConfig && (
        <StepDowngradeWarning
          fromConfig={currentConfig}
          toConfig={selectedConfig}
          lostBenefits={lostBenefits}
          colors={colors}
          onConfirm={handleConfirmDowngrade}
          onBack={() => setStep('select')}
        />
      )}

      {step === 'payment' && selectedConfig && (
        <StepPayment
          selectedTier={selectedConfig}
          colors={colors}
          onPay={handlePay}
          onBack={() => setStep('select')}
        />
      )}

      {step === 'processing' && selectedConfig && (
        <StepProcessing colors={colors} tierConfig={selectedConfig} />
      )}

      {step === 'success' && selectedConfig && (
        <StepSuccess
          tierConfig={selectedConfig}
          colors={colors}
          onDone={handleDone}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 48,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  stepTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.text,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  tierCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tierCardInner: {
    padding: 20,
  },
  tierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierCardBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tierCardTitleArea: {
    flex: 1,
  },
  tierCardName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  tierCardTagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  currentBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  currentBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  tierCardPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    marginBottom: 16,
  },
  tierBenefitsList: {
    gap: 8,
    marginBottom: 16,
  },
  tierBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tierBenefitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  tierSelectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  tierSelectBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#000',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  warningTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.text,
    flex: 1,
  },
  warningDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  lostBenefitsCard: {
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  lostBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  lostBenefitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  warningPriceCompare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  priceBoxLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceBoxValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  confirmDowngradeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  confirmDowngradeBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#000',
  },
  keepPlanBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  keepPlanBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  paymentCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  selectedTierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  selectedTierName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    flex: 1,
  },
  selectedTierPrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  fieldInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: Colors.surfaceLight,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  payBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  payBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textTertiary,
  },
  centeredStep: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  processingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginTop: 24,
  },
  processingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  successBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  successBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#000',
  },
});
