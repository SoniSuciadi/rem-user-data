import { Injectable } from '@nestjs/common';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class PermittingService {
  db: pgPromise.IDatabase<pg.IClient, pg.IClient>;
  constructor(private readonly databaseService: DatabaseService) {
    this.db = databaseService.db;
  }
  getSubmission() {
    return this.db.manyOrNone(
      `
         WITH submission_rab AS (
            SELECT *
            FROM (
                SELECT *,
                    ROW_NUMBER() OVER (PARTITION BY version ORDER BY created_at DESC) as rn
                FROM rem_submission_rab_versions
            ) t
            WHERE t.rn = 1 AND t.deleted_at IS NULL
        )
        SELECT 
            s.name AS "Nama Pengajuan",
            s.consultant_name AS "Konsultan",
            sr.type AS "Jenis Izin",
            dc.name AS "Izin",
            sr.qty AS "Jumlah Izin",
            sr.price AS "Harga Satuan",
            sr.price * sr.qty AS "Total Anggaran",
            CASE WHEN sr.total_price_based_by = 'AREA' THEN mb.name ELSE '' END AS "Blok",
            CASE WHEN sr.total_price_based_by = 'AREA' THEN oo.name ELSE '' END AS "Nomor unit",
            CASE WHEN sr.total_price_based_by != 'AREA' THEN mb.name ELSE '' END AS "Blok",
            CASE WHEN sr.total_price_based_by != 'AREA' THEN oo.name ELSE '' END AS "Nomor unit",
            srvu.area AS "Luas",
            ms.phase AS "Tahap Pembangunan"
        FROM rem_submissions s
        LEFT JOIN submission_rab sr ON sr.submission_id = s.id
        LEFT JOIN rem_document_categories dc ON sr.document_category_id = dc.id
        LEFT JOIN rem_submission_rab_version_units srvu ON srvu.submission_rab_version_id = sr.id
        LEFT JOIN rem_output_objects oo ON oo.id = srvu.output_object_id
        LEFT JOIN rem_master_blocks mb ON mb.id = oo.master_block_id
        LEFT JOIN rem_submission_rab_versions_stages srvs ON srvs.submission_rab_version_id = sr.id
        LEFT JOIN rem_master_stages ms ON ms.id = srvs.stage_id
        WHERE s.project_id=1
        `,
    );
  }
  getDocumentSubmission() {
    return this.db.manyOrNone(
      `
        WITH lands AS (
            SELECT 
                s.id, 
                l.uuid,
                lv.plot_number
            FROM rem_submissions s 
            LEFT JOIN rem_submission_lands sl ON sl.submission_id = s.id
            LEFT JOIN rem_land_versions lv ON lv.id = sl.land_version_id
            LEFT JOIN rem_lands l ON l.id = lv.land_id
        )

        SELECT 
            s.name,
            array_agg(DISTINCT l.uuid || '-' || l.plot_number) AS "Kumpulan Tanah (ID Tanah)",
            (jsonb_agg(CASE WHEN sd.document_category_id = 33 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 33))[0]->>'url' AS "URL Izin Lingkungan",
            (jsonb_agg(CASE WHEN sd.document_category_id = 14 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 14))[0]->>'url' AS "URL Pertek",
            (jsonb_agg(CASE WHEN sd.document_category_id = 32 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 32))[0]->>'url' AS "URL PKKPR",
            (jsonb_agg(CASE WHEN sd.document_category_id = 34 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 34))[0]->>'url' AS "PBT",
            (jsonb_agg(CASE WHEN sd.document_category_id = 19 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 19))[0]->>'url' AS "SK Kepala BPN",
            (jsonb_agg(CASE WHEN sd.document_category_id = 16 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 16))[0]->>'url' AS "SHGB Induk",
            (jsonb_agg(CASE WHEN sd.document_category_id = 35 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 35))[0]->>'url' AS "CTM",
            (jsonb_agg(CASE WHEN sd.document_category_id = 18 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 18))[0]->>'url' AS "Siteplan",
            (jsonb_agg(CASE WHEN sd.document_category_id = 7 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 7))[0]->>'url' AS "Andalalin",
            (jsonb_agg(CASE WHEN sd.document_category_id = 12 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 12))[0]->>'url' AS "Peil Banjir",
            (jsonb_agg(CASE WHEN sd.document_category_id = 28 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 28))[0]->>'url' AS "UKL/UPL",
            (jsonb_agg(CASE WHEN sd.document_category_id = 37 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 37))[0]->>'url' AS "Damija",
            (jsonb_agg(CASE WHEN sd.document_category_id = 38 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 38))[0]->>'url' AS "Basta",
            (jsonb_agg(CASE WHEN sd.document_category_id = 8 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 8))[0]->>'url' AS "IMB/PBG Induk",
            (jsonb_agg(CASE WHEN sd.document_category_id = 13 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 13))[0]->>'url' AS "PDRT",
            mb.name AS "Blok",
            oo.name AS "Unit",
            (jsonb_agg(CASE WHEN sd.document_category_id = 39 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 39))[0]->>'url' AS "Dokumen PLN",
            (jsonb_agg(CASE WHEN sd.document_category_id = 40 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 40))[0]->>'url' AS "PDAM",
            (jsonb_agg(CASE WHEN sd.document_category_id = 41 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 41))[0]->>'url' AS "Damkar",
            mb.name AS "Blok",
            oo.name AS "Unit",
            (jsonb_agg(CASE WHEN sd.document_category_id = 17 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 17))[0]->>'url' AS "SHGB Pecah",
            mb.name AS "Blok",
            oo.name AS "Unit",
            (jsonb_agg(CASE WHEN sd.document_category_id = 9 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 9))[0]->>'url' AS "PBG/IMB Pecah",
            mb.name AS "Blok",
            oo.name AS "Unit",
            (jsonb_agg(CASE WHEN sd.document_category_id = 22 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 22))[0]->>'url' AS "SPPT PBB Pecah",
            (jsonb_agg(CASE WHEN sd.document_category_id = 48 THEN sd.files ELSE NULL END) FILTER (WHERE sd.document_category_id = 48))[0]->>'url' AS "SPPT PBB Induk"

        FROM rem_submissions s 
        LEFT JOIN lands l ON l.id = s.id
        LEFT JOIN rem_submission_documents sd ON sd.submission_id = s.id
        LEFT JOIN rem_output_objects oo ON oo.id=sd.output_object_id
        LEFT JOIN rem_master_blocks mb ON mb.id=oo.master_block_id
        WHERE s.project_id=1
        GROUP BY s.id, s.name,mb.name,oo.name;

        `,
    );
  }
  getConsultantBillPayment() {
    return this.db.manyOrNone(
      `
         SELECT 
            sb.name AS "Info Tagihan",
            sb.amount AS "Nominal Tagihan",
            sb.due_at AS "Jatuh Tempo",
            sb.files AS "Berkas Penagihan",
            sp.category AS "Kategori",
            sp.amount AS "Nominal Pembayaran",
            sp.method AS "Metode Pembayaran",
            sp.detail->'receiverInfo'->>'name' AS "Penerima",
            sp.detail->>'cashLocation' AS "Lokasi Pembayaran",  
            sp.detail->'receiverInfo'->>'accountNumber' AS "Nomor Rekening",
            sp.date AS "Tanggal Transaksi",
            sp.detail->>'checkgiroReceiverBank' AS "Bank Penerima (Cek/giro)", 
            sp.detail->>'checkgiroIssuer' AS "PT. Penerbit", 
            sp.detail->>'checkgiroIssuerBank' AS "Bank Penerbit Cek/giro",  
            sp.detail->>'checkgiroNumber' AS "Nomor Cek/giro",  
            sp.detail->>'checkgiroIssuerAccount' AS "No. Rekening Penerbit",  
            sp.detail->>'checkgiroAmount' AS "Nominal Cek/giro",  
            sp.detail->>'checkgiroCreationDate' AS "Tanggal Dibuat", 
            sp.detail->>'checkgiroDisbursmentDate' AS "Tanggal Pencairan",
            sp.description AS "Keterangan",
            sp.proof AS "Bukti Pembayaran"
        FROM rem_submissions s 
        LEFT JOIN rem_submission_bills sb ON sb.submission_id = s.id
        LEFT JOIN rem_submission_payments sp ON sp.bill_id = sb.id
        WHERE sb.due_at IS NOT NULL AND s.project_id=1;
        `,
    );
  }
  getpermmitBillPayment() {
    return this.db.manyOrNone(
      `
        SELECT 
            sb.name AS "Jenis Izin",
            dc.name AS "Izin",
            srv.qty AS "Jumlah Izin",
            srv.price*srv.qty AS "Anggaran",
            sp.category AS "Kategori",
            sp.amount AS "Nominal Pembayaran",
            sp.method AS "Metode Pembayaran",
            sp.detail->'receiverInfo'->>'name' AS "Penerima",
            sp.detail->>'cashLocation' AS "Lokasi Pembayaran",  
            sp.detail->'receiverInfo'->>'accountNumber' AS "Nomor Rekening",
            sp.date AS "Tanggal Transaksi",
            sp.detail->>'checkgiroReceiverBank' AS "Bank Penerima (Cek/giro)", 
            sp.detail->>'checkgiroIssuer' AS "PT. Penerbit", 
            sp.detail->>'checkgiroIssuerBank' AS "Bank Penerbit Cek/giro",  
            sp.detail->>'checkgiroNumber' AS "Nomor Cek/giro",  
            sp.detail->>'checkgiroIssuerAccount' AS "No. Rekening Penerbit",  
            sp.detail->>'checkgiroAmount' AS "Nominal Cek/giro",  
            sp.detail->>'checkgiroCreationDate' AS "Tanggal Dibuat", 
            sp.detail->>'checkgiroDisbursmentDate' AS "Tanggal Pencairan",
            sp.description AS "Keterangan",
            sp.proof AS "Bukti Pembayaran"
        FROM rem_submissions s 
        LEFT JOIN rem_submission_bills sb ON sb.submission_id = s.id
        LEFT JOIN rem_submission_payments sp ON sp.bill_id = sb.id
        LEFT JOIN rem_submission_rab_versions srv ON srv.id = sb.submission_rab_version_id
        LEFT JOIN rem_document_categories dc ON dc.id=srv.document_category_id
        WHERE sb.submission_rab_version_id IS NOT NULL AND s.project_id=1
        `,
    );
  }
}
