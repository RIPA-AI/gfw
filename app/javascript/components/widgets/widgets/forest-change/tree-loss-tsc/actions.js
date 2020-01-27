import axios from 'axios';
import { getExtent, getLoss } from 'services/analysis-cached';

export default ({ params }) =>
  axios
    .all([
      getLoss({ ...params, forestType: 'tsc', tsc: true }),
      getExtent({ ...params })
    ])
    .then(
      axios.spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data.filter(d => d.bound1 !== 'Unknown'),
            extent: (loss.data.data && extent.data.data[0].value) || 0
          };
        }
        return data;
      })
    );
