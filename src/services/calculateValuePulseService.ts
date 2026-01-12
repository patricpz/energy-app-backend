export const calculateValuePulseService = {
    calculatePulseValue: (params: {
        kwh: number,
        te: number,
        tusd: number,
        flag: number,
        icms: number,
        cip: number,
    }) => {
        const subtotal = params.kwh * (params.te + params.tusd + params.flag);
        const icmsValue = subtotal / ( 1 - params.icms );
        const pisConfins = icmsValue * 0.0485;

        return icmsValue + pisConfins + params.cip;
    }
}