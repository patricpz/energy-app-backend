import "dotenv/config";
import * as xlsx from "xlsx";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";

type DistributorRow = {
    "Código ARAT"?: string | number;
    "SIGLA"?: string;
    "UF"?: string;
    "CNPJ"?: string;
}

const prisma = new PrismaClient();

async function main() {
    const filePath = path.resolve(
        __dirname,
        "../data/AreaatuadistbaseBI.xlsx"
    );
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<DistributorRow>(sheet);

    for (const row of rows) {
        const code = String(row["Código ARAT"] ?? "").trim();
        const name = String(row["SIGLA"] ?? "").trim();
        const state = String(row["UF"] ?? "").trim().toUpperCase();
        const cnpj = String(row["CNPJ"] ?? "").trim();

        if (!code || !name || state.length !== 2 || !cnpj) continue;

        await prisma.energyDistributor.upsert({
            where: {code},
            update: {name, state, cnpj},
            create: {code, name, state, cnpj}
        });
    }
}

main()
    .then(() => {
        console.log("Energy distributor imported");
    })
    .catch((e) => {
        console.error("Energy distributor error import", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })