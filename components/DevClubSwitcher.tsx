import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useClub } from '@/lib/contexts/ClubContext';
import { http } from '@/lib/http';
import {
  clearDevClubSlugOverride,
  getRecentDevSlugs,
  reloadAppForDevOverride,
  setDevClubSlugOverride,
} from '@/lib/dev-club-override';

interface ClubListItem {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
}

/**
 * Floating dev-only overlay that lets you switch the active club slug at
 * runtime. Renders nothing in production builds.
 */
export function DevClubSwitcher() {
  const { clubSlug, club } = useClub();
  const [open, setOpen] = useState(false);
  const [clubs, setClubs] = useState<ClubListItem[] | null>(null);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [customSlug, setCustomSlug] = useState('');
  const [applying, setApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingClubs(true);
    setErrorMsg(null);
    http
      .get<ClubListItem[]>('/public/clubs')
      .then((res) => {
        if (!cancelled) setClubs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Failed to load clubs';
          setErrorMsg(`Couldn't list clubs: ${msg}`);
          setClubs([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingClubs(false);
      });
    getRecentDevSlugs().then((r) => {
      if (!cancelled) setRecent(r);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const sorted = useMemo(() => {
    if (!clubs) return [];
    return [...clubs].sort((a, b) => a.name.localeCompare(b.name));
  }, [clubs]);

  const apply = async (slug: string) => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      setErrorMsg('Enter a slug.');
      return;
    }
    setApplying(true);
    setErrorMsg(null);
    try {
      const res = await http.get(`/public/clubs/${trimmed}`);
      if (!res.data || typeof res.data !== 'object') {
        throw new Error('Club not found');
      }
      await setDevClubSlugOverride(trimmed);
      reloadAppForDevOverride();
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setErrorMsg(
        status === 404
          ? `No club with slug "${trimmed}".`
          : `Couldn't switch: ${e instanceof Error ? e.message : 'unknown error'}`,
      );
      setApplying(false);
    }
  };

  const clear = async () => {
    setApplying(true);
    await clearDevClubSlugOverride();
    reloadAppForDevOverride();
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Switch club (dev)"
        onPress={() => setOpen(true)}
        style={styles.fab}
      >
        <Text style={styles.fabLabel}>club: {clubSlug}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.title}>Switch Club (dev)</Text>
            <Text style={styles.subtitle}>
              Active: {club?.name ?? clubSlug} ({clubSlug})
            </Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <Text style={styles.sectionLabel}>All clubs</Text>
            {loadingClubs ? (
              <ActivityIndicator color="#fff" style={{ marginVertical: 12 }} />
            ) : (
              <ScrollView style={styles.list}>
                {sorted.length === 0 ? (
                  <Text style={styles.muted}>
                    No clubs returned by /public/clubs.
                  </Text>
                ) : (
                  sorted.map((c) => {
                    const isActive = c.slug === clubSlug;
                    return (
                      <Pressable
                        key={c.id}
                        onPress={() => !applying && apply(c.slug)}
                        style={[styles.row, isActive && styles.rowActive]}
                      >
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: c.primaryColor ?? '#666' },
                          ]}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>{c.name}</Text>
                          <Text style={styles.rowSlug}>{c.slug}</Text>
                        </View>
                        {isActive ? <Text style={styles.activeMark}>●</Text> : null}
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            )}

            {recent.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>Recent</Text>
                <View style={styles.chips}>
                  {recent.map((slug) => (
                    <Pressable
                      key={slug}
                      onPress={() => !applying && apply(slug)}
                      style={styles.chip}
                    >
                      <Text style={styles.chipText}>{slug}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            <Text style={styles.sectionLabel}>Custom slug</Text>
            <View style={styles.customRow}>
              <TextInput
                value={customSlug}
                onChangeText={setCustomSlug}
                placeholder="my-club-slug"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onSubmitEditing={() => apply(customSlug)}
              />
              <Pressable
                onPress={() => apply(customSlug)}
                style={[styles.applyBtn, applying && { opacity: 0.5 }]}
                disabled={applying}
              >
                <Text style={styles.applyBtnText}>
                  {applying ? 'Reloading…' : 'Apply'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.footerRow}>
              <Pressable onPress={clear} disabled={applying}>
                <Text style={styles.linkBtn}>Clear override</Text>
              </Pressable>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={styles.linkBtn}>Close</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 12,
    bottom: Platform.select({ web: 12, default: 90 }),
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 9999,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#15151A',
    borderRadius: 12,
    borderColor: '#2A2A33',
    borderWidth: 1,
    padding: 16,
    maxHeight: '85%',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9aa0a6',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#9aa0a6',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  list: { maxHeight: 240 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  rowActive: { backgroundColor: 'rgba(255,255,255,0.06)' },
  rowTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  rowSlug: { color: '#7a7f88', fontSize: 11 },
  activeMark: { color: '#4ade80', fontSize: 14 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1F1F26',
    borderRadius: 999,
    borderColor: '#2A2A33',
    borderWidth: 1,
  },
  chipText: { color: '#cfd2d8', fontSize: 12 },
  customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#0E0E13',
    color: '#fff',
    borderColor: '#2A2A33',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  applyBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  applyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  linkBtn: { color: '#60a5fa', fontSize: 13 },
  error: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  muted: { color: '#7a7f88', fontSize: 12, padding: 8 },
});

export default DevClubSwitcher;
