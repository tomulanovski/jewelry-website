import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import NavBar from '../components/navbar';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

// ─── Design tokens ───────────────────────────────────────────────────────────
const GOLD = 'rgb(227, 217, 177)';
const BLACK = '#000000';
const GOLD_DIM = 'rgba(227, 217, 177, 0.55)';
const GOLD_BORDER = 'rgba(227, 217, 177, 0.25)';

// ─── Craft pillar data ────────────────────────────────────────────────────────
const CRAFT_PILLARS = [
  {
    title: '14k & 18k Solid Gold',
    body: 'The only metals Catherine works with. No plating, no shortcuts — just enduring solid gold that ages beautifully and lasts generations.',
  },
  {
    title: 'Natural Gemstones',
    body: 'Sapphires, diamonds, rubies, aquamarine, chalcedony, apatite, and more. Each stone is chosen by hand for its character and colour.',
  },
  {
    title: 'Handmade from Start to Finish',
    body: 'No factory. No casting house. Every piece is drawn, shaped, set, and polished by Catherine alone — from the first sketch to the final shine.',
  },
];

// ─── Story paragraphs ────────────────────────────────────────────────────────
const STORY_PARAGRAPHS = [
  `Catherine grew up in a home saturated with art, history, and antiques. From an early age she understood that objects carry stories — that a well-made thing holds time inside it. That sensibility never left her.`,
  `Gemstones became her obsession because they are, in a very literal sense, living history: formed over millions of years, shaped by the earth, and surfaced for one brief human moment. She approaches every stone the same way — studying it, listening to it, then drawing a setting that honours exactly what makes that particular stone irreplaceable.`,
  `From that first drawing, every step is hers. She works the metal by hand, sets the stone herself, and does the final polish herself. There is no factory, no assistant, no compromise. When the piece arrives with you, it has been touched by exactly one pair of hands.`,
];

// ─── Photo placeholder grid items ────────────────────────────────────────────
const PHOTO_PLACEHOLDERS = [
  'Studio portrait',
  'Gemstone collection',
  'At the workbench',
  'Finished pieces',
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <Divider
      sx={{
        borderColor: GOLD_BORDER,
        my: { xs: 6, md: 8 },
        mx: 'auto',
        width: '60px',
      }}
    />
  );
}

function PhotoPlaceholder({ label }) {
  return (
    <Box
      sx={{
        aspectRatio: '1 / 1',
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        backgroundColor: 'rgba(227,217,177,0.03)',
      }}
    >
      <CameraAltOutlinedIcon sx={{ fontSize: '2rem', color: GOLD_DIM }} />
      <Typography
        variant="caption"
        sx={{
          color: GOLD_DIM,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontSize: '0.65rem',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function CraftPillar({ title, body }) {
  return (
    <Box
      sx={{
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: '2px',
        p: { xs: 3, md: 4 },
        height: '100%',
        backgroundColor: 'rgba(227,217,177,0.03)',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: GOLD,
          fontWeight: 600,
          letterSpacing: '0.06em',
          mb: 1.5,
          fontSize: { xs: '0.95rem', md: '1rem' },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: GOLD_DIM,
          lineHeight: 1.8,
          fontSize: { xs: '0.875rem', md: '0.9rem' },
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function About() {
  return (
    <Box sx={{ backgroundColor: BLACK, minHeight: '100vh' }}>
      <NavBar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          textAlign: 'center',
          pt: { xs: 8, md: 12 },
          pb: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: GOLD,
            fontWeight: 300,
            letterSpacing: '0.08em',
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
            mb: 2,
          }}
        >
          Meet Catherine
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: GOLD_DIM,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            mb: 3,
          }}
        >
          Artisan Jeweler · Kadima, Israel
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: GOLD,
            maxWidth: '560px',
            mx: 'auto',
            lineHeight: 1.9,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            opacity: 0.85,
          }}
        >
          Catherine handcrafts solid 14k and 18k gold jewelry built around bold
          natural gemstones — each piece a singular, unhurried thing made entirely
          by her own hands.
        </Typography>
      </Box>

      {/* ── Content wrapper ───────────────────────────────────────────────── */}
      <Box
        sx={{
          maxWidth: '860px',
          mx: 'auto',
          px: { xs: 3, sm: 4, md: 6 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <SectionDivider />

        {/* ── The Story ─────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: GOLD_DIM,
              letterSpacing: '0.25em',
              fontSize: '0.7rem',
            }}
          >
            The Story
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {STORY_PARAGRAPHS.map((paragraph, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{
                color: GOLD,
                lineHeight: 1.9,
                opacity: 0.85,
                fontSize: { xs: '0.95rem', md: '1rem' },
              }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>

        <SectionDivider />

        {/* ── Her Craft ─────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              color: GOLD_DIM,
              letterSpacing: '0.25em',
              fontSize: '0.7rem',
            }}
          >
            Her Craft
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {CRAFT_PILLARS.map((pillar) => (
            <Grid item xs={12} sm={4} key={pillar.title}>
              <CraftPillar {...pillar} />
            </Grid>
          ))}
        </Grid>

        <SectionDivider />

        {/* ── Photo placeholders ─────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              color: GOLD_DIM,
              letterSpacing: '0.25em',
              fontSize: '0.7rem',
            }}
          >
            The Studio
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {PHOTO_PLACEHOLDERS.map((label) => (
            <Grid item xs={6} sm={3} key={label}>
              <PhotoPlaceholder label={label} />
            </Grid>
          ))}
        </Grid>

        <SectionDivider />

        {/* ── Video placeholder ──────────────────────────────────────────── */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            backgroundColor: 'rgba(227,217,177,0.02)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: GOLD_DIM,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
            }}
          >
            A glimpse into the studio — coming soon
          </Typography>
        </Box>

        <SectionDivider />

        {/* ── Custom Orders ──────────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: GOLD_DIM,
              letterSpacing: '0.25em',
              fontSize: '0.7rem',
              display: 'block',
              mb: 3,
            }}
          >
            Custom Orders
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: GOLD,
              opacity: 0.85,
              maxWidth: '520px',
              mx: 'auto',
              lineHeight: 1.9,
              mb: 4,
              fontSize: { xs: '0.95rem', md: '1rem' },
            }}
          >
            Have a stone you love, or a piece you've imagined but never found?
            Catherine welcomes custom commissions. Tell her your idea and she'll
            bring it to life — one of a kind, made for you.
          </Typography>

          <Button
            variant="outlined"
            size="large"
            href="mailto:info@cjbijoux.com"
            sx={{
              color: GOLD,
              borderColor: GOLD_BORDER,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              px: 4,
              py: 1.25,
              '&:hover': {
                borderColor: GOLD,
                backgroundColor: 'rgba(227,217,177,0.06)',
              },
            }}
          >
            Get in Touch
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
