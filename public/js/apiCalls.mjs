//*********** API *************
// read history data from db api
export async function historyData(id) {
  const response = await fetch(`http://172.20.10.4:8888/history/${id}`);
  const data = await response.json();
  return data;
}
// read dry_delivery data from db api
export const deliveryData = async (id) => {
  const response = await fetch(`http://172.20.10.4:8888/dry_delivery/${id}`);
  const data = await response.json();
  return data;
};

// read dsd_delivery data from db api
export const dsdDelivery = async (id) => {
  const response = await fetch(`http://172.20.10.4:8888/dsd_delivery/${id}`);
  const data = await response.json();
  return data;
};

// read sales history data from db api
export const salesHistory = async (id) => {
  const response = await fetch(`http://172.20.10.4:8888/sales_history/${id}`);
  const data = await response.json();
  return data;
};

// read search data from db api
export const loadData = async (query) => {
  const response = await fetch(`http://172.20.10.4:8888/search?q=${query}`);
  const data = await response.json();
  return data;
};

// read top products data from db api
export const loadKvi = async () => {
  const response = await fetch(`http://172.20.10.4:8888/kvi/`);
  const data = await response.json();
  return data;
};

// read total sales data from db api
export const loadWastePercentage = async () => {
  const response = await fetch(`http://172.20.10.4:8888/sales/`);
  const data = await response.json();
  return data;
};

// read writeoff data from db api
export const loadWriteOff = async () => {
  const response = await fetch(`http://172.20.10.4:8888/writeoff/`);
  const data = await response.json();
  return data;
};
// read high value data from db api
export const loadHighValue = async () => {
  const response = await fetch(`http://172.20.10.4:8888/high_value/`);
  const data = await response.json();
  return data;
};

// read missing availiability data from db api
export const loadMissingAvailiability = async () => {
  const response = await fetch(`http://172.20.10.4:8888/missing_availability/`);
  const data = await response.json();
  return data;
};
