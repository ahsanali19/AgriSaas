// backend/src/modules/sponsorship/sponsorship.controller.ts
import { Request, Response } from 'express';
import { db } from '../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class SponsorshipController {

  /**
   * GET /api/sponsorships/active
   * Fetches active direct B2B Agri-sponsor banners for specific UI placement areas
   * (e.g., 'dashboard_top', 'marketplace_sidebar').
   */
  static async getActiveSponsorships(req: Request, res: Response): Promise<void> {
    try {
      const placementArea = req.query.placement_area as string;

      let query = `
        SELECT id, sponsor_name, image_url, placement_area, link, tagline, badge_text, cta_text, impressions_count, clicks_count
        FROM sponsorship_banners
        WHERE status = 'active'
      `;
      const params: any[] = [];

      if (placementArea) {
        query += ` AND placement_area = ?`;
        params.push(placementArea);
      }

      query += ` ORDER BY RAND() LIMIT 10`;

      const [rows] = await db.query<RowDataPacket[]>(query, params);

      // Async increment impression count for served banners
      if (rows.length > 0) {
        const bannerIds = rows.map(r => r.id);
        db.query(
          `UPDATE sponsorship_banners SET impressions_count = impressions_count + 1 WHERE id IN (?)`,
          [bannerIds]
        ).catch(e => console.warn('Could not record banner impressions:', e.message));
      }

      res.json({
        success: true,
        count: rows.length,
        banners: rows.map(row => ({
          id: row.id,
          sponsorName: row.sponsor_name,
          imageUrl: row.image_url,
          placementArea: row.placement_area,
          link: row.link,
          tagline: row.tagline,
          badgeText: row.badge_text || 'Verified Agri Partner',
          ctaText: row.cta_text || 'View Special Offer',
          impressionsCount: Number(row.impressions_count || 0),
          clicksCount: Number(row.clicks_count || 0)
        }))
      });
    } catch (err: any) {
      console.error('Error fetching active sponsorships:', err);
      res.status(500).json({
        success: false,
        message: 'Could not fetch sponsorships.',
        error: err.message
      });
    }
  }

  /**
   * POST /api/sponsorships/:id/click
   * Records a user click on a direct B2B Agri-sponsor banner.
   */
  static async recordClick(req: Request, res: Response): Promise<void> {
    try {
      const bannerId = Number(req.params.id);

      if (!bannerId) {
        res.status(400).json({ success: false, message: 'Invalid sponsor banner ID.' });
        return;
      }

      await db.query(
        `UPDATE sponsorship_banners SET clicks_count = clicks_count + 1 WHERE id = ?`,
        [bannerId]
      );

      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT link FROM sponsorship_banners WHERE id = ?`,
        [bannerId]
      );

      res.json({
        success: true,
        redirectUrl: rows[0]?.link || 'https://agrisaas.com'
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Could not record click.',
        error: err.message
      });
    }
  }
}
