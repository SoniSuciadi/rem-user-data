import { Injectable } from '@nestjs/common';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class LandService {
  db: pgPromise.IDatabase<pg.IClient, pg.IClient>;
  constructor(private readonly databaseService: DatabaseService) {
    this.db = databaseService.db;
  }
  getLandList(projectId: string) {
    return this.db.manyOrNone(
      `
            CREATE OR REPLACE FUNCTION get_document_url (data jsonb, doc_name text)
                RETURNS text
                AS $$
            DECLARE
                result text;
            BEGIN
                SELECT
                    x.url INTO result
                FROM
                    jsonb_array_elements(data) AS elem
                CROSS JOIN LATERAL jsonb_to_record(elem) AS x (url text,
                    name text)
            WHERE
                x.name = doc_name
            LIMIT 1;
                RETURN result;
            END;
            $$
            LANGUAGE plpgsql
            IMMUTABLE;

            WITH last_land_version AS (
                SELECT
                    *
                FROM (
                    SELECT
                        *,
                        row_number() OVER (PARTITION BY land_id ORDER BY created_at DESC) AS rn
                FROM
                    rem_land_versions) t
                WHERE
                    t.rn = 1
            ),
            payment_summary AS (
                SELECT
                    lp.land_id AS land_id,
                    sum(
                        CASE WHEN lpd.category = 'BAYAR' THEN
                            lpd.amount
                        ELSE
                            0
                        END) AS bayar,
                    sum(
                        CASE WHEN lpd.category = 'DENDA' THEN
                            lpd.amount
                        ELSE
                            0
                        END) AS denda,
                    sum(
                        CASE WHEN lpd.category = 'KOMPENSASI' THEN
                            lpd.amount
                        ELSE
                            0
                        END) AS kompensasi,
                    sum(
                        CASE WHEN lpd.category = 'LAIN-LAIN' THEN
                            lpd.amount
                        ELSE
                            0
                        END) AS lain_lain,
                    sum(lpd.amount) AS total_pembayaran
            FROM
                rem_land_payment_details lpd
                LEFT JOIN rem_land_payments lp ON lp.id = lpd.payment_id
            GROUP BY
                lp.land_id
            ),
            land_stakeholder_list AS
            (
                SELECT 
                    ls.land_id, 
                    array_agg(s.name) AS "list_stakeholder",
                    array_agg(ls.label) AS "list_label"
                FROM  rem_lands_stakeholders ls 
                LEFT JOIN rem_stakeholders s ON s.id=ls.stakeholder_id 
                WHERE ls.label !='OWNER'
                GROUP BY ls.land_id
                
            )
            SELECT
                l.uuid AS "Id Tanah",
                ms.phase AS "Tahap",
                llv.plot_number AS " No Plot",
                llv.tax_object_number AS "NOP",
                llv.acquisition_status AS "Status Akuisisi",
                s.name AS "Nama Pemilik",
                ls.land_area AS "Luas",
                llv.transaction_price / ls.land_area AS "Harga m²",
                llv.transaction_price AS "Total Harga",
                ps.bayar AS "Total Pembayaran",
                ps.kompensasi AS "Total Kompensasi",
                ps.denda AS "Total Denda",
                ps.lain_lain AS "Total Pembayaran Lain",
                get_document_url (llv.milestone -> 'pre_acquisition', 'Kartu Keluarga') AS "KK Pemilik",
                get_document_url (llv.milestone -> 'pre_acquisition', 'Kartu Tanda Penduduk') AS "KTP Pemilik",
                get_document_url (llv.milestone -> 'pre_acquisition', 'Surat Pemberitahuan Pajak Terhutang Pajak Bumi dan Bangunan') AS "SPPT PBB",
                get_document_url (llv.milestone -> 'pre_acquisition', 'Peta Bidang') AS "Peta Bidang",
                get_document_url (llv.milestone -> 'pre_acquisition', 'Bukti Kepemilikan Tanah') AS "Peta Bidang",
                get_document_url (llv.milestone -> 'on_acquisition', 'Bukti Pembayaran') AS "Bukti Pembayaran",
                get_document_url (llv.milestone -> 'on_acquisition', 'Draft Surat Pelepasan Hak') AS "Draft SPH",
                get_document_url (llv.milestone -> 'on_acquisition', 'Draft Warkah') AS "Draft Warkah",
                get_document_url (llv.milestone -> 'post_acquisition', 'Surat Pelepasan Hak') AS "SPH",
                get_document_url (llv.milestone -> 'post_acquisition', 'Akta Jual Beli') AS "AJB",
                get_document_url (llv.milestone -> 'post_acquisition', 'Warkah') AS "Warkah",
                get_document_url (llv.milestone -> 'post_acquisition', 'Foto Dengan Pemilik') AS "Foto Dengan Pemilik",
                lsl.list_stakeholder AS "Nama Stakeholder",
                lsl.list_label AS "Label Stakeholder"
            FROM
                rem_lands l
                LEFT JOIN last_land_version llv ON llv.land_id = l.id
                LEFT JOIN rem_land_stages ls ON ls.land_version_id = llv.id
                LEFT JOIN rem_master_stages ms ON ms.id = ls.stage_id
                LEFT JOIN rem_lands_stakeholders lsh ON lsh.land_id = l.id
                    AND lsh.label = 'OWNER'
                LEFT JOIN rem_stakeholders s ON s.id = lsh.stakeholder_id
                LEFT JOIN payment_summary ps ON ps.land_id = l.id
                LEFT JOIN land_stakeholder_list lsl ON lsl.land_id=l.id
            WHERE l.project_Id=$<projectId>
        `,
      { projectId },
    );
  }
}
