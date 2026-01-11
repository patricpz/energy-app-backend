import "dotenv/config";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const filePath = path.resolve(
    __dirname,
    "../data/tarifas-homologadas-distribuidoras-energia-eletrica.csv"
);

type TariffRow = {
    SigAgente?: string;
    DatInicioVigencia?: string;
    DatFimVigencia?: string;
    DscModalidadeTarifaria?: string;
    DscClasse?: string;
    DscSubClasse?: string;
    NomPostoTarifario?: string;
    VlrTE?: string;
    VlrTUSD?: string;
    DscREH?: string;
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  return new Date(`${year}-${month}-${day}`);
}

async function main() {
    const rows: TariffRow[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({ separator: ";" }))
          .on("data", (data) => rows.push(data))
          .on("end", resolve)
          .on("error", reject);
    });

    const distributors = await prisma.energyDistributor.findMany();
    const distributorMap = new Map(
        distributors.map(d => [d.name, d])
    );

    for (const row of rows) {
        if (row.DscClasse != "Residencial") continue;
        
        const sigAgente = row.SigAgente?.trim();
        if (!sigAgente) continue;
        const distributor = distributorMap.get(sigAgente);
        if (!distributor) continue;
        
        const startDate = parseDate(row.DatInicioVigencia);
        if (!startDate) continue; 

        const endDate = parseDate(row.DatFimVigencia);

        const te = row.VlrTE ? Number(row.VlrTE.replace(",", ".")) : null;
        const tusd = row.VlrTUSD ? Number(row.VlrTUSD.replace(",", ".")) : null;

        const modality = row.DscModalidadeTarifaria?.trim();
        if (!modality) continue;
        const subClass = row.DscSubClasse?.trim() || "PADRAO";
        const tariffPost = row.NomPostoTarifario?.trim() || "UNICO";


        await prisma.energyTariff.upsert({
            where: {
                distributorId_startDate_modality_subClass_tariffPost: {
                    distributorId: distributor.id,
                    startDate,
                    modality,
                    subClass,
                    tariffPost,
                },
            },
            update: {
                te,
                tusd,
                endDate,
                reh: row.DscREH!,
            },
            create: {
                distributorId: distributor.id,
                startDate,
                endDate,
                modality,
                subClass,
                tariffPost,
                te,
                tusd,
                reh: row.DscREH!,
            },
        });
    }

    console.log("EnergyTariff imported");
}

main()
    .catch((e) => {
        console.error("Error import EnergyTariff: ", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })