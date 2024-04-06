// 图层相关常变量

export const layerNames_basic = //基础图层名称
{
  'road': '原始路网',
  'building': '建筑物',
  'reserveLands': '储备用地',
  'municipalFacilities': '市政设施',
  'hospitals': '医疗设施',
  'CommunicationBaseStation': '通信服务'
};
export const layerNames_residential = //居民区韧性图层
{
  'Hospital': '医疗',
  'School': '教育',
  'Shopping': '商业零售',
  'Aid': '应急医疗',
  'Shelter': '避难场所',
  'Supply': '救灾物资',
  'Break': '消防站',
  'Work': '就业'
};
export const layerNames_residential_dangerous = //居民区韧性图层
{
  'HospitalDangerousArea': '医疗',
  'SchoolDangerousArea': '教育',
  'ShoppingDangerousArea': '商业零售',
  'AidDangerousArea': '应急医疗',
  'ShelterDangerousArea': '避难场所',
  'SupplyDangerousArea': '救灾物资',
  'BreakDangerousArea': '消防站',
  'WorkDangerousArea': '就业'
};

export const layerNames_flood = //洪涝模拟图层名称
{
  'submergedCells': '淹没区域',
  'dangerousRoads': '危险路网',
  'submergedRoads': '淹没路网',
  'availableRoads': '可用路网',
  'riskCells': '危险区域',
  'riskPoints': '危险点'
};

export const layerColors = //图层颜色
{
  'road': '#FFD700',
  'building': '#778899',
  'submergedCells': '#0000ff',
  'dangerousRoads': '#00ffff',
  'availableRoads': '#008000',
  'riskCells': '#ff0000',
  'riskPoints': '#ef9308',
  'reserveLands': '#7fff00',
  'municipalFacilities': '#7b68ee',
  'hospitals': '#ff6a6a',
  'CommunicationBaseStation': '#226d92',
  'grid': '#1a9850',
  'riskInfection': 'red',
  'Aid': '#a527b6',
  'Shelter': '#091da4',
  'Supply': '#0ea81b',
  'Break': '#17277a',
  'Hospital': '#480d8f',
  'School': '#16b9c9',
  'Work': '#082faf',
  'Shopping': '#07ce35',
  'AidDangerousArea': '#a527b6',
  'ShelterDangerousArea': '#091da4',
  'SupplyDangerousArea': '#0ea81b',
  'BreakDangerousArea': '#17277a',
  'HospitalDangerousArea': '#480d8f',
  'SchoolDangerousArea': '#16b9c9',
  'WorkDangerousArea': '#082faf',
  'ShoppingDangerousArea': '#07ce35'
};

export const planSelectionColors =  // 手动规划选址图层颜色
{
  'Aid': '#F56C6C',
  'Shelter': '#67C23A',
  'Supply': '#409EFF',
  'Break': '#ff0000',
  'Hospital': '#0a5cf5',
  'School': '#5dff00',
  'Work': '#eaf300',
  'Shopping': '#bd00ff'
};
