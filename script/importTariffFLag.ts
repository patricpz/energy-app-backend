import "dotenv/config";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

type TariffFLag = {
    DatGeracaoConjuntoDados: string;
    DatCompetencia: string;
    NomBandeiraAcionada: string;
    VlrAdicionalBandeira: string;
}


const filePath = path.resolve(
    __dirname,
    "../data/bandeira-tarifaria-acionamento.csv"
)

async function main() {
    const rows: TariffFLag[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(
            csv({
                separator: ";",
                mapHeaders: ({ header }) => header.trim(),
            })
          )
          .on("data", (row) => rows.push(row))
          .on("end", resolve)
          .on("error", reject)
    });

    for (const row of rows) {
        try {
            const date = new Date(row.DatCompetencia);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            const name = row.NomBandeiraAcionada.trim();

            const additionalKwh = Number(row.VlrAdicionalBandeira.replace(",", ".")) / 1000;

            if (isNaN(additionalKwh)) {
                console.warn("Invalid Value: ", row.VlrAdicionalBandeira);
                continue
            }

            await prisma.tariffFlag.upsert({
                where: {
                year_month: {
                    year,
                    month,
                },
                },
                update: { name, additionalKwh },
                create: {
                    year,
                    month,
                    name,
                    additionalKwh
                },
            });
        } catch (e) {
            console.log("Import Err: ", row.DatCompetencia, e);
        }
    }

    console.log("Tariff Flag Imported");
}

main()
    .catch((e) => {
        console.error("Error import EnergyTariff: ", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })