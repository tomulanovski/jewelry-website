import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import NavBar from '../components/navbar';
import { brand } from '../theme';

const CRAFT_PILLARS = [
  {
    title: '14k & 18k Solid Gold',
    body: 'The only metals Catherine works with. No plating and no shortcuts, just solid gold that ages beautifully and lasts for generations.',
  },
  {
    title: 'Natural Gemstones',
    body: 'Sapphires, diamonds, rubies, aquamarine, chalcedony, apatite and more. Each stone is chosen by hand for its character and color.',
  },
  {
    title: 'Made by Hand',
    body: 'No factory and no casting house. Catherine draws, shapes, sets and polishes every piece herself, from the first sketch to the final shine.',
  },
];

const STORY_PARAGRAPHS = [
  'Catherine grew up in a home full of art, history and antiques. From an early age she understood that objects carry stories, and that a well-made thing holds time inside it. That feeling never left her.',
  'Gemstones became her passion because they are living history: formed over millions of years and brought to the surface for one brief human moment. She approaches every stone the same way. She studies it, then draws a setting that shows off exactly what makes that stone special.',
  'From that first drawing, every step is hers. She works the metal, sets the stone and does the final polish herself. There is no factory and no assistant. When the piece reaches you, it has been touched by one pair of hands.',
];

const bodySx = { color: brand.text, lineHeight: 1.9, fontSize: { xs: '1rem', md: '1.05rem' } };

function Section({ label, children }) {
  return (
    <Box sx={{ py: { xs: 6, md: 9 }, borderTop: `1px solid ${brand.line}` }}>
      <Typography variant="overline" component="h2" sx={{ display: 'block', textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function About() {
  return (
    <Box>
      <NavBar />

      <Box sx={{ textAlign: 'center', pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 9 }, px: 3 }}>
        <Typography variant="overline" component="p">
          Artisan jeweler
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2.8rem', md: '4.2rem' }, color: brand.text, my: 2 }}
        >
          Meet Catherine
        </Typography>
        <Typography sx={{ ...bodySx, color: brand.goldSoft, maxWidth: 560, mx: 'auto' }}>
          Catherine handcrafts solid 14k and 18k gold jewelry around bold natural gemstones. Each piece is one of a kind and made entirely by her own hands.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 860, mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Section label="The Story">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {STORY_PARAGRAPHS.map((paragraph, i) => (
              <Typography key={i} sx={bodySx}>
                {paragraph}
              </Typography>
            ))}
          </Box>
        </Section>

        <Section label="Her Craft">
          <Grid container spacing={{ xs: 4, sm: 3 }}>
            {CRAFT_PILLARS.map((pillar) => (
              <Grid item xs={12} sm={4} key={pillar.title}>
                <Typography variant="h5" sx={{ color: brand.text, mb: 1.5 }}>
                  {pillar.title}
                </Typography>
                <Typography sx={{ color: brand.muted, lineHeight: 1.8, fontSize: '0.92rem' }}>
                  {pillar.body}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section label="Custom Orders">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ ...bodySx, maxWidth: 540, mx: 'auto', mb: 4 }}>
              Have a stone you love, or a piece you've imagined but never found? Catherine welcomes custom commissions. Tell her your idea and she'll make it, one of a kind and just for you.
            </Typography>
            <Button variant="outlined" href="mailto:info@cjbijoux.com">
              Get in touch
            </Button>
          </Box>
        </Section>
      </Box>
    </Box>
  );
}
