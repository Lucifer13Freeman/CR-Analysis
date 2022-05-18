import { AnalysisParamsType } from "../types/types";


export interface IAnalysisParams
{
    meanSqrOffX: AnalysisParamsType;
    meanSqrOffY: AnalysisParamsType;

    linearCorrCoef: AnalysisParamsType;
    avgCorrCoefErr: AnalysisParamsType;

    coefCorrSignCheck: AnalysisParamsType;
    signLvlSelectVal: AnalysisParamsType;

    tTable: AnalysisParamsType;
    
    relXY: AnalysisParamsType;
    coefCorrSign: AnalysisParamsType;

    spearmanCoeff: AnalysisParamsType;
    elasticity: AnalysisParamsType;

    avgApproxErr: AnalysisParamsType;

    factorDispersion: AnalysisParamsType;
    residualDispersion: AnalysisParamsType;

    totalDispersion: AnalysisParamsType;
    totalDispersionCheck: AnalysisParamsType;

    theorCoefDeterm: AnalysisParamsType;
    theorCorrRel: AnalysisParamsType;

    avgA0Err: AnalysisParamsType;
    avgA1Err: AnalysisParamsType;

    tA0: AnalysisParamsType;
    tA1: AnalysisParamsType;

    tA0Check: AnalysisParamsType;
    tA1Check: AnalysisParamsType;

    fisherCrit: AnalysisParamsType;
    fTableValLvl: AnalysisParamsType;
    fTableValLvlSelectVal: AnalysisParamsType;
    fTableValLvlCheck: AnalysisParamsType;
}