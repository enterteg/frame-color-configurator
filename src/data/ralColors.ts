// RAL Color Database - Referenced by ID
export interface RALColor {
  code: string;
  hex: string;
  name: string;
}

// Main color database - key is the RAL number (ID)
export const ralColors: Record<string, RALColor> = {
  // Yellows (1000-1099)
  '1000': { code: 'RAL 1000', hex: '#CCC58F', name: 'Green beige' },
  '1001': { code: 'RAL 1001', hex: '#D1BC8A', name: 'Beige' },
  '1002': { code: 'RAL 1002', hex: '#D2B773', name: 'Sand yellow' },
  '1003': { code: 'RAL 1003', hex: '#F7BA0B', name: 'Signal yellow' },
  '1004': { code: 'RAL 1004', hex: '#E2B007', name: 'Golden yellow' },
  '1005': { code: 'RAL 1005', hex: '#C89F04', name: 'Honey yellow' },
  '1006': { code: 'RAL 1006', hex: '#E1A100', name: 'Maize yellow' },
  '1007': { code: 'RAL 1007', hex: '#E79C00', name: 'Daffodil yellow' },
  '1011': { code: 'RAL 1011', hex: '#AF8A54', name: 'Brown beige' },
  '1012': { code: 'RAL 1012', hex: '#D9C022', name: 'Lemon yellow' },
  '1013': { code: 'RAL 1013', hex: '#E9E5CE', name: 'Oyster white' },
  '1014': { code: 'RAL 1014', hex: '#DFCEA1', name: 'Ivory' },
  '1015': { code: 'RAL 1015', hex: '#EADEBD', name: 'Light ivory' },
  '1016': { code: 'RAL 1016', hex: '#EAF044', name: 'Sulfur yellow' },
  '1017': { code: 'RAL 1017', hex: '#F4B752', name: 'Saffron yellow' },
  '1018': { code: 'RAL 1018', hex: '#F3E03B', name: 'Zinc yellow' },
  '1019': { code: 'RAL 1019', hex: '#A4957D', name: 'Grey beige' },
  '1020': { code: 'RAL 1020', hex: '#9A9464', name: 'Olive yellow' },
  '1021': { code: 'RAL 1021', hex: '#EEC900', name: 'Rape yellow' },
  '1023': { code: 'RAL 1023', hex: '#F0CA00', name: 'Traffic yellow' },
  '1024': { code: 'RAL 1024', hex: '#B89C50', name: 'Ochre yellow' },
  '1026': { code: 'RAL 1026', hex: '#F5FF00', name: 'Luminous yellow' },
  '1027': { code: 'RAL 1027', hex: '#A38C15', name: 'Curry' },
  '1028': { code: 'RAL 1028', hex: '#FFAB00', name: 'Melon yellow' },
  '1032': { code: 'RAL 1032', hex: '#DDB20F', name: 'Broom yellow' },
  '1033': { code: 'RAL 1033', hex: '#FAAB21', name: 'Dahlia yellow' },
  '1034': { code: 'RAL 1034', hex: '#EDAB56', name: 'Pastel yellow' },
  '1035': { code: 'RAL 1035', hex: '#A29985', name: 'Pearl beige' },
  '1036': { code: 'RAL 1036', hex: '#927549', name: 'Pearl gold' },
  '1037': { code: 'RAL 1037', hex: '#EEA205', name: 'Sun yellow' },

  // Oranges (2000-2099)
  '2000': { code: 'RAL 2000', hex: '#DD7907', name: 'Yellow orange' },
  '2001': { code: 'RAL 2001', hex: '#BE4E20', name: 'Red orange' },
  '2002': { code: 'RAL 2002', hex: '#C63927', name: 'Vermillion' },
  '2003': { code: 'RAL 2003', hex: '#FA842B', name: 'Pastel orange' },
  '2004': { code: 'RAL 2004', hex: '#E75B12', name: 'Pure orange' },
  '2005': { code: 'RAL 2005', hex: '#FF2300', name: 'Luminous orange' },
  '2007': { code: 'RAL 2007', hex: '#FFA421', name: 'Luminous bright orange' },
  '2008': { code: 'RAL 2008', hex: '#F3752C', name: 'Bright red orange' },
  '2009': { code: 'RAL 2009', hex: '#E15501', name: 'Traffic orange' },
  '2010': { code: 'RAL 2010', hex: '#D4652F', name: 'Signal orange' },
  '2011': { code: 'RAL 2011', hex: '#EC7C25', name: 'Deep orange' },
  '2012': { code: 'RAL 2012', hex: '#DB6A50', name: 'Salmon orange' },
  '2013': { code: 'RAL 2013', hex: '#954527', name: 'Pearl orange' },

  // Reds (3000-3099)
  '3000': { code: 'RAL 3000', hex: '#AB2524', name: 'Flame red' },
  '3001': { code: 'RAL 3001', hex: '#A02128', name: 'Signal red' },
  '3002': { code: 'RAL 3002', hex: '#A1232B', name: 'Carmine red' },
  '3003': { code: 'RAL 3003', hex: '#8D1D2C', name: 'Ruby red' },
  '3004': { code: 'RAL 3004', hex: '#701F29', name: 'Purple red' },
  '3005': { code: 'RAL 3005', hex: '#5E2028', name: 'Wine red' },
  '3007': { code: 'RAL 3007', hex: '#402225', name: 'Black red' },
  '3009': { code: 'RAL 3009', hex: '#703731', name: 'Oxide red' },
  '3011': { code: 'RAL 3011', hex: '#7E292C', name: 'Brown red' },
  '3012': { code: 'RAL 3012', hex: '#CB8D73', name: 'Beige red' },
  '3013': { code: 'RAL 3013', hex: '#9C322E', name: 'Tomato red' },
  '3014': { code: 'RAL 3014', hex: '#D47479', name: 'Antique pink' },
  '3015': { code: 'RAL 3015', hex: '#E1A6AD', name: 'Light pink' },
  '3016': { code: 'RAL 3016', hex: '#AC4034', name: 'Coral red' },
  '3017': { code: 'RAL 3017', hex: '#D3545F', name: 'Rose' },
  '3018': { code: 'RAL 3018', hex: '#D14152', name: 'Strawberry red' },
  '3020': { code: 'RAL 3020', hex: '#C1121C', name: 'Traffic red' },
  '3022': { code: 'RAL 3022', hex: '#D56D56', name: 'Salmon pink' },
  '3024': { code: 'RAL 3024', hex: '#F70000', name: 'Luminous red' },
  '3026': { code: 'RAL 3026', hex: '#FF0000', name: 'Luminous bright red' },
  '3027': { code: 'RAL 3027', hex: '#B42041', name: 'Raspberry red' },
  '3028': { code: 'RAL 3028', hex: '#E72512', name: 'Pure red' },
  '3031': { code: 'RAL 3031', hex: '#AC323B', name: 'Orient red' },
  '3032': { code: 'RAL 3032', hex: '#711521', name: 'Pearl ruby red' },
  '3033': { code: 'RAL 3033', hex: '#B24C43', name: 'Pearl pink' },

  // Violets (4000-4099)
  '4001': { code: 'RAL 4001', hex: '#8A5A83', name: 'Red lilac' },
  '4002': { code: 'RAL 4002', hex: '#933D50', name: 'Red violet' },
  '4003': { code: 'RAL 4003', hex: '#D15B8F', name: 'Heather violet' },
  '4004': { code: 'RAL 4004', hex: '#691639', name: 'Claret violet' },
  '4005': { code: 'RAL 4005', hex: '#83639D', name: 'Blue lilac' },
  '4006': { code: 'RAL 4006', hex: '#992572', name: 'Traffic purple' },
  '4007': { code: 'RAL 4007', hex: '#4A203B', name: 'Purple violet' },
  '4008': { code: 'RAL 4008', hex: '#904684', name: 'Signal violet' },
  '4009': { code: 'RAL 4009', hex: '#A38995', name: 'Pastel violet' },
  '4010': { code: 'RAL 4010', hex: '#C63678', name: 'Telemagenta' },
  '4011': { code: 'RAL 4011', hex: '#8773A1', name: 'Pearl violet' },
  '4012': { code: 'RAL 4012', hex: '#6B6880', name: 'Pearl blackberry' },

  // Blues (5000-5099)
  '5000': { code: 'RAL 5000', hex: '#384C70', name: 'Violet blue' },
  '5001': { code: 'RAL 5001', hex: '#1F4764', name: 'Green blue' },
  '5002': { code: 'RAL 5002', hex: '#2B2C7C', name: 'Ultramarine blue' },
  '5003': { code: 'RAL 5003', hex: '#2A3756', name: 'Sapphire blue' },
  '5004': { code: 'RAL 5004', hex: '#1D1F2A', name: 'Black blue' },
  '5005': { code: 'RAL 5005', hex: '#154889', name: 'Signal blue' },
  '5007': { code: 'RAL 5007', hex: '#41678D', name: 'Brilliant blue' },
  '5008': { code: 'RAL 5008', hex: '#313C48', name: 'Grey blue' },
  '5009': { code: 'RAL 5009', hex: '#2E5978', name: 'Azure blue' },
  '5010': { code: 'RAL 5010', hex: '#13447C', name: 'Gentian blue' },
  '5011': { code: 'RAL 5011', hex: '#232C3F', name: 'Steel blue' },
  '5012': { code: 'RAL 5012', hex: '#3481B8', name: 'Light blue' },
  '5013': { code: 'RAL 5013', hex: '#232D53', name: 'Cobalt blue' },
  '5014': { code: 'RAL 5014', hex: '#6C7C98', name: 'Pigeon blue' },
  '5015': { code: 'RAL 5015', hex: '#2874B2', name: 'Sky blue' },
  '5017': { code: 'RAL 5017', hex: '#0E518D', name: 'Traffic blue' },
  '5018': { code: 'RAL 5018', hex: '#21888F', name: 'Turquoise blue' },
  '5019': { code: 'RAL 5019', hex: '#1A5784', name: 'Capri blue' },
  '5020': { code: 'RAL 5020', hex: '#0B4151', name: 'Ocean blue' },
  '5021': { code: 'RAL 5021', hex: '#07737A', name: 'Water blue' },
  '5022': { code: 'RAL 5022', hex: '#2F2A5A', name: 'Night blue' },
  '5023': { code: 'RAL 5023', hex: '#4D668E', name: 'Distant blue' },
  '5024': { code: 'RAL 5024', hex: '#6A93B0', name: 'Pastel blue' },
  '5025': { code: 'RAL 5025', hex: '#296478', name: 'Pearl Gentian blue' },
  '5026': { code: 'RAL 5026', hex: '#102C54', name: 'Pearl night blue' },

  // Greens (6000-6099)
  '6000': { code: 'RAL 6000', hex: '#327662', name: 'Patina green' },
  '6001': { code: 'RAL 6001', hex: '#28713E', name: 'Emerald green' },
  '6002': { code: 'RAL 6002', hex: '#276235', name: 'Leaf green' },
  '6003': { code: 'RAL 6003', hex: '#4B573E', name: 'Olive Green' },
  '6004': { code: 'RAL 6004', hex: '#0E4243', name: 'Blue green' },
  '6005': { code: 'RAL 6005', hex: '#0F4336', name: 'Moss green' },
  '6006': { code: 'RAL 6006', hex: '#40433B', name: 'Grey olive' },
  '6007': { code: 'RAL 6007', hex: '#283424', name: 'Bottle green' },
  '6008': { code: 'RAL 6008', hex: '#35382E', name: 'Brown green' },
  '6009': { code: 'RAL 6009', hex: '#26392F', name: 'Fir green' },
  '6010': { code: 'RAL 6010', hex: '#3E753B', name: 'Grass green' },
  '6011': { code: 'RAL 6011', hex: '#68825B', name: 'Reseda green' },
  '6012': { code: 'RAL 6012', hex: '#31403D', name: 'Black green' },
  '6013': { code: 'RAL 6013', hex: '#797C5A', name: 'Reed green' },
  '6014': { code: 'RAL 6014', hex: '#444337', name: 'Yellow olive' },
  '6015': { code: 'RAL 6015', hex: '#3D403A', name: 'Black olive' },
  '6016': { code: 'RAL 6016', hex: '#026A52', name: 'Turquoise green' },
  '6017': { code: 'RAL 6017', hex: '#468641', name: 'May green' },
  '6018': { code: 'RAL 6018', hex: '#48A43F', name: 'Yellow green' },
  '6019': { code: 'RAL 6019', hex: '#B7D9B1', name: 'Pastel green' },
  '6020': { code: 'RAL 6020', hex: '#354733', name: 'Chrome green' },
  '6021': { code: 'RAL 6021', hex: '#86A47C', name: 'Pale green' },
  '6022': { code: 'RAL 6022', hex: '#3E3C32', name: 'Brown olive' },
  '6024': { code: 'RAL 6024', hex: '#008754', name: 'Traffic green' },
  '6025': { code: 'RAL 6025', hex: '#53753C', name: 'Fern green' },
  '6026': { code: 'RAL 6026', hex: '#005D52', name: 'Opal green' },
  '6027': { code: 'RAL 6027', hex: '#81C0BB', name: 'Light green' },
  '6028': { code: 'RAL 6028', hex: '#2D5546', name: 'Pine green' },
  '6029': { code: 'RAL 6029', hex: '#007243', name: 'Mint green' },
  '6032': { code: 'RAL 6032', hex: '#0F8558', name: 'Signal green' },
  '6033': { code: 'RAL 6033', hex: '#478A84', name: 'Mint turquoise' },
  '6034': { code: 'RAL 6034', hex: '#7FB0B2', name: 'Pastel turquoise' },
  '6035': { code: 'RAL 6035', hex: '#1B542C', name: 'Pearl green' },
  '6036': { code: 'RAL 6036', hex: '#005D4C', name: 'Pearl opal green' },
  '6037': { code: 'RAL 6037', hex: '#25E712', name: 'Pure green' },
  '6038': { code: 'RAL 6038', hex: '#00F700', name: 'Luminous green' },

  // Greys (7000-7099)
  '7000': { code: 'RAL 7000', hex: '#7E8B92', name: 'Squirrel grey' },
  '7001': { code: 'RAL 7001', hex: '#8F999F', name: 'Silver grey' },
  '7002': { code: 'RAL 7002', hex: '#817F68', name: 'Olive grey' },
  '7003': { code: 'RAL 7003', hex: '#7A7B6D', name: 'Moss grey' },
  '7004': { code: 'RAL 7004', hex: '#9EA0A1', name: 'Signal grey' },
  '7005': { code: 'RAL 7005', hex: '#6B716F', name: 'Mouse grey' },
  '7006': { code: 'RAL 7006', hex: '#756F61', name: 'Beige grey' },
  '7008': { code: 'RAL 7008', hex: '#746643', name: 'Khaki grey' },
  '7009': { code: 'RAL 7009', hex: '#5B6259', name: 'Green grey' },
  '7010': { code: 'RAL 7010', hex: '#575D57', name: 'Tarpaulin grey' },
  '7011': { code: 'RAL 7011', hex: '#555D61', name: 'Iron grey' },
  '7012': { code: 'RAL 7012', hex: '#596163', name: 'Basalt grey' },
  '7013': { code: 'RAL 7013', hex: '#555548', name: 'Brown grey' },
  '7015': { code: 'RAL 7015', hex: '#51565C', name: 'Slate grey' },
  '7016': { code: 'RAL 7016', hex: '#373F43', name: 'Anthracite grey' },
  '7021': { code: 'RAL 7021', hex: '#2E3234', name: 'Black grey' },
  '7022': { code: 'RAL 7022', hex: '#4B4D46', name: 'Umbra grey' },
  '7023': { code: 'RAL 7023', hex: '#818479', name: 'Concrete grey' },
  '7024': { code: 'RAL 7024', hex: '#474A50', name: 'Graphite grey' },
  '7026': { code: 'RAL 7026', hex: '#374447', name: 'Granite grey' },
  '7030': { code: 'RAL 7030', hex: '#939388', name: 'Stone grey' },
  '7031': { code: 'RAL 7031', hex: '#5D6970', name: 'Blue grey' },
  '7032': { code: 'RAL 7032', hex: '#B9B9A8', name: 'Pebble grey' },
  '7033': { code: 'RAL 7033', hex: '#818979', name: 'Cement grey' },
  '7034': { code: 'RAL 7034', hex: '#939176', name: 'Yellow grey' },
  '7035': { code: 'RAL 7035', hex: '#CBD0CC', name: 'Light grey' },
  '7036': { code: 'RAL 7036', hex: '#9A9697', name: 'Platinum grey' },
  '7037': { code: 'RAL 7037', hex: '#7C7F7E', name: 'Dusty grey' },
  '7038': { code: 'RAL 7038', hex: '#B4B8B0', name: 'Agate grey' },
  '7039': { code: 'RAL 7039', hex: '#6B695F', name: 'Quartz grey' },
  '7040': { code: 'RAL 7040', hex: '#9DA3A6', name: 'Window grey' },
  '7042': { code: 'RAL 7042', hex: '#8F9695', name: 'Traffic grey A' },
  '7043': { code: 'RAL 7043', hex: '#4E5451', name: 'Traffic grey B' },
  '7044': { code: 'RAL 7044', hex: '#BDBDB2', name: 'Silk grey' },
  '7045': { code: 'RAL 7045', hex: '#91969A', name: 'Telegrey 1' },
  '7046': { code: 'RAL 7046', hex: '#82898E', name: 'Telegrey 2' },
  '7047': { code: 'RAL 7047', hex: '#CFD0CF', name: 'Telegrey 4' },
  '7048': { code: 'RAL 7048', hex: '#888175', name: 'Pearl mouse grey' },

  // Browns (8000-8099)
  '8000': { code: 'RAL 8000', hex: '#887142', name: 'Green brown' },
  '8001': { code: 'RAL 8001', hex: '#9C6B30', name: 'Ochre brown' },
  '8002': { code: 'RAL 8002', hex: '#7B5141', name: 'Signal brown' },
  '8003': { code: 'RAL 8003', hex: '#80542F', name: 'Clay brown' },
  '8004': { code: 'RAL 8004', hex: '#8F4E35', name: 'Copper brown' },
  '8007': { code: 'RAL 8007', hex: '#6F4A2F', name: 'Fawn brown' },
  '8008': { code: 'RAL 8008', hex: '#6F4F28', name: 'Olive brown' },
  '8011': { code: 'RAL 8011', hex: '#5A3A29', name: 'Nut brown' },
  '8012': { code: 'RAL 8012', hex: '#673831', name: 'Red brown' },
  '8014': { code: 'RAL 8014', hex: '#49392D', name: 'Sepia brown' },
  '8015': { code: 'RAL 8015', hex: '#633A34', name: 'Chestnut brown' },
  '8016': { code: 'RAL 8016', hex: '#4C2F26', name: 'Mahogany brown' },
  '8017': { code: 'RAL 8017', hex: '#44322D', name: 'Chocolate brown' },
  '8019': { code: 'RAL 8019', hex: '#3F3A3A', name: 'Grey brown' },
  '8022': { code: 'RAL 8022', hex: '#211F20', name: 'Black brown' },
  '8023': { code: 'RAL 8023', hex: '#A65E2F', name: 'Orange brown' },
  '8024': { code: 'RAL 8024', hex: '#79553C', name: 'Beige brown' },
  '8025': { code: 'RAL 8025', hex: '#755C49', name: 'Pale brown' },
  '8028': { code: 'RAL 8028', hex: '#4E3B31', name: 'Terra brown' },
  '8029': { code: 'RAL 8029', hex: '#763C28', name: 'Pearl copper' },

  // Whites/Blacks (9000-9099)
  '9001': { code: 'RAL 9001', hex: '#FDF4E3', name: 'Cream' },
  '9002': { code: 'RAL 9002', hex: '#E7EBDA', name: 'Grey white' },
  '9003': { code: 'RAL 9003', hex: '#F4F4F4', name: 'Signal white' },
  '9004': { code: 'RAL 9004', hex: '#282828', name: 'Signal black' },
  '9005': { code: 'RAL 9005', hex: '#0A0A0A', name: 'Jet black' },
  '9006': { code: 'RAL 9006', hex: '#A5A5A5', name: 'White aluminum' },
  '9007': { code: 'RAL 9007', hex: '#8F8F8F', name: 'Grey aluminum' },
  '9010': { code: 'RAL 9010', hex: '#FFFFFF', name: 'Pure white' },
  '9011': { code: 'RAL 9011', hex: '#1C1C1C', name: 'Graphite black' },
  '9016': { code: 'RAL 9016', hex: '#F6F6F6', name: 'Traffic white' },
  '9017': { code: 'RAL 9017', hex: '#1E1E1E', name: 'Traffic black' },
  '9018': { code: 'RAL 9018', hex: '#D7D7D7', name: 'Papyrus white' },
  '9022': { code: 'RAL 9022', hex: '#9C9C9C', name: 'Pearl light grey' },
  '9023': { code: 'RAL 9023', hex: '#828282', name: 'Pearl dark grey' },
};

// Helper function to get color by ID
export const getColorById = (id: string): RALColor | undefined => {
  return ralColors[id];
};

// Helper function to get hex by ID
export const getColorHex = (id: string): string => {
  return ralColors[id]?.hex || '#000000';
};

// Helper function to get all colors as array
export const getAllColors = (): RALColor[] => {
  return Object.values(ralColors);
};

// Color groups for UI organization
export interface RALColorGroup {
  name: string;
  colorIds: string[];
}

export const ralColorGroups: RALColorGroup[] = [
  {
    name: 'Yellows',
    colorIds: ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1011', '1012', '1013', '1014', '1015', '1016', '1017', '1018', '1019', '1020', '1021', '1023', '1024', '1026', '1027', '1028', '1032', '1033', '1034', '1035', '1036', '1037']
  },
  {
    name: 'Oranges',
    colorIds: ['2000', '2001', '2002', '2003', '2004', '2005', '2007', '2008', '2009', '2010', '2011', '2012', '2013']
  },
  {
    name: 'Reds',
    colorIds: ['3000', '3001', '3002', '3003', '3004', '3005', '3007', '3009', '3011', '3012', '3013', '3014', '3015', '3016', '3017', '3018', '3020', '3022', '3024', '3026', '3027', '3028', '3031', '3032', '3033']
  },
  {
    name: 'Violets',
    colorIds: ['4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010', '4011', '4012']
  },
  {
    name: 'Blues',
    colorIds: ['5000', '5001', '5002', '5003', '5004', '5005', '5007', '5008', '5009', '5010', '5011', '5012', '5013', '5014', '5015', '5017', '5018', '5019', '5020', '5021', '5022', '5023', '5024', '5025', '5026']
  },
  {
    name: 'Greens',
    colorIds: ['6000', '6001', '6002', '6003', '6004', '6005', '6006', '6007', '6008', '6009', '6010', '6011', '6012', '6013', '6014', '6015', '6016', '6017', '6018', '6019', '6020', '6021', '6022', '6024', '6025', '6026', '6027', '6028', '6029', '6032', '6033', '6034', '6035', '6036', '6037', '6038']
  },
  {
    name: 'Greys',
    colorIds: ['7000', '7001', '7002', '7003', '7004', '7005', '7006', '7008', '7009', '7010', '7011', '7012', '7013', '7015', '7016', '7021', '7022', '7023', '7024', '7026', '7030', '7031', '7032', '7033', '7034', '7035', '7036', '7037', '7038', '7039', '7040', '7042', '7043', '7044', '7045', '7046', '7047', '7048']
  },
  {
    name: 'Browns',
    colorIds: ['8000', '8001', '8002', '8003', '8004', '8007', '8008', '8011', '8012', '8014', '8015', '8016', '8017', '8019', '8022', '8023', '8024', '8025', '8028', '8029']
  },
  {
    name: 'Whites & Blacks',
    colorIds: ['9001', '9002', '9003', '9004', '9005', '9006', '9007', '9010', '9011', '9016', '9017', '9018', '9022', '9023']
  }
];

// Default colors - using same color for easy debugging
export const DEFAULT_FRAME_COLOR_ID = '1013'; // Sepia brown
export const DEFAULT_FORK_COLOR_ID = '1013';  // Sepia brown  
export const DEFAULT_LOGO_COLOR_ID = '1013';  // Sepia brown 