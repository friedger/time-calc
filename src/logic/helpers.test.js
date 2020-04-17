import { CalculationHelper, StoreHelper, TimeHelper } from './helpers';

describe('Logic - CalculationHelper', () => {
  const expected = {
    break: '00:30',
    date: '12/12/2012',
    duration: '01:30',
    end: '14:00',
    start: '12:00',
  };
  const given = { start: '12:00', break: '00:30', end: '14:00', date: '12/12/2012' };

  it('can calculate on the client', () => {
    const result = CalculationHelper.calculateLocal(given);

    expect(result).toEqual(expected);
  });
});

describe('Logic - TimeHelper', () => {
  it('sorts a list of times by comparing the dates', () => {
    let times = [{ date: '12/12/2012' }, { date: '01/01/1970' }];

    expect(TimeHelper.sortTimes(times)).toEqual([{ date: '01/01/1970' }, { date: '12/12/2012' }]);
  });

  it('generates a CSV of times and gives a download', () => {
    window.open = jest.fn();

    let times = [{ date: '12/12/2012' }, { date: '01/01/1970' }];

    TimeHelper.downloadTimes(times);

    expect(window.open).toBeCalledWith(
      'data:text/csv;charset=utf-8;base64,ImRhdGUiCiIxMi8xMi8yMDEyIgoiMDEvMDEvMTk3MCI='
    );
  });
});

describe('Logic - StoreHelper', () => {
  let storeGet;
  let storeSet;

  // beforeAll(() => {
  // TODO jest 19
  //     storeGet = jest.spyOn(StoreHelper, 'get');
  //     storeSet = jest.spyOn(StoreHelper, 'set');
  // })

  xit('returns an array of times from local-storage', () => {
    const times = StoreHelper.loadTimes();

    expect(storeGet).toBeCalled();
    expect(times).toBe([]);
  });

  xit('saves times to local-storage', () => {
    const times = StoreHelper.saveTimes([]);

    expect(storeGet).toBeCalled();
    expect(times).toBe([]);
  });
});
