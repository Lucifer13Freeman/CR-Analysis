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
    relXYspearman: AnalysisParamsType;
    elasticity: AnalysisParamsType;

    avgApproxErr: AnalysisParamsType;

    factorDispersion: AnalysisParamsType;
    residualDispersion: AnalysisParamsType;

    totalDispersion: AnalysisParamsType;
    totalDispersionCheck: AnalysisParamsType;

    theorCoefDeterm: AnalysisParamsType;
    theorCorrRel: AnalysisParamsType;

    func: AnalysisParamsType;

    a0: AnalysisParamsType;
    a1: AnalysisParamsType;
    a2: AnalysisParamsType;

    avgA0Err: AnalysisParamsType;
    avgA1Err: AnalysisParamsType;
    avgA2Err: AnalysisParamsType;

    tA0: AnalysisParamsType;
    tA1: AnalysisParamsType;
    tA2: AnalysisParamsType;

    tA0Check: AnalysisParamsType;
    tA1Check: AnalysisParamsType;
    tA2Check: AnalysisParamsType;

    fisherCrit: AnalysisParamsType;
    fTableValLvl: AnalysisParamsType;
    fTableValLvlSelectVal: AnalysisParamsType;
    fTableValLvlCheck: AnalysisParamsType;

    V1: number;
    V2: number;
    count: number;
}