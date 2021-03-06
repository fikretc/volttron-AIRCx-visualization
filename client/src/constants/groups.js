// Copyright (c) 2020, Battelle Memorial Institute
// All rights reserved.

// 1.  Battelle Memorial Institute (hereinafter Battelle) hereby grants
//     permission to any person or entity lawfully obtaining a copy of this
//     software and associated documentation files (hereinafter "the Software")
//     to redistribute and use the Software in source and binary forms, with or
//     without modification.  Such person or entity may use, copy, modify, merge,
//     publish, distribute, sublicense, and/or sell copies of the Software, and
//     may permit others to do so, subject to the following conditions:

//     -   Redistributions of source code must retain the above copyright notice,
//         this list of conditions and the following disclaimers.

//     -          Redistributions in binary form must reproduce the above copyright
//         notice, this list of conditions and the following disclaimer in the
//         documentation and/or other materials provided with the distribution.

//     -          Other than as used herein, neither the name Battelle Memorial Institute
//         or Battelle may be used in any form whatsoever without the express
//         written consent of Battelle.

// 2. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//     AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//     IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//     ARE DISCLAIMED. IN NO EVENT SHALL BATTELLE OR CONTRIBUTORS BE LIABLE FOR
//     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//     DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//     SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
//     CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//     LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//     OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
//     DAMAGE.

// The views and conclusions contained in the software and documentation are those
// of the authors and should not be interpreted as representing official policies,
// either expressed or implied, of the FreeBSD Project.

// This material was prepared as an account of work sponsored by an agency of the
// United States Government. Neither the United States Government nor the United
// States Department of Energy, nor Battelle, nor any of their employees, nor any
// jurisdiction or organization that has cooperated in the development of these
// materials, makes any warranty, express or implied, or assumes any legal
// liability or responsibility for the accuracy, completeness, or usefulness or
// any information, apparatus, product, software, or process disclosed, or
// represents that its use would not infringe privately owned rights.

// Reference herein to any specific commercial product, process, or service by
// trade name, trademark, manufacturer, or otherwise does not necessarily
// constitute or imply its endorsement, recommendation, or favoring by the
// United States Government or any agency thereof, or Battelle Memorial Institute.
// The views and opinions of authors expressed herein do not necessarily state or
// reflect those of the United States Government or any agency thereof.

// PACIFIC NORTHWEST NATIONAL LABORATORY
// operated by
// BATTELLE for the UNITED STATES DEPARTMENT OF ENERGY
// under Contract DE-AC05-76RL01830

import _ from "lodash";
import moment from "moment";

const groupEntries = (entries) => {
  return entries.reduce((c, e, i) => {
    const [key, value] = e;
    const [date, range] = key.split(" ");
    const [start, end] = range.split("-");
    const [pk, pv] = i > 0 ? c[c.length - 1] : ["0-0-0 0:0-0:0", []];
    const [pd, pr] = pk.split(" ");
    const [ps, pe] = pr.split("-");
    if (date === pd && end === ps) {
      if (i > 0) {
        c.pop();
      }
      c.push([`${date} ${start}-${pe}`, _.concat(pv, value)]);
    } else {
      c.push(e);
    }
    return c;
  }, []);
};

export default {
  values: [
    {
      name: "day",
      label: "One Day",
      range: moment.duration(1, "days"),
      increment: "hour",
      step: moment.duration(1, "hours"),
      headers: ["Date", "Time"],
      values: [(v) => v.split(" ")[0], (v) => v.split(" ")[1]],
      buildBin: (timestamp) => {
        const date = moment(timestamp);
        return `${date.format("YYYY-MM-DD HH:00")}-${date
          .add(1, "hours")
          .format("HH:00")}`;
      },
      binToDate: (bin) => moment(bin, "YYYY-MM-DD HH:00"),
      groupEntries: groupEntries,
    },
    {
      name: "week",
      label: "One Week",
      range: moment.duration(1, "weeks"),
      increment: "hour",
      step: moment.duration(1, "hours"),
      headers: ["Date", "Time"],
      values: [(v) => v.split(" ")[0], (v) => v.split(" ")[1]],
      buildBin: (timestamp) => {
        const date = moment(timestamp);
        return `${date.format("YYYY-MM-DD HH:00")}-${date
          .add(1, "hours")
          .format("HH:00")}`;
      },
      binToDate: (bin) => moment(bin, "YYYY-MM-DD HH:00"),
      groupEntries: groupEntries,
    },
    {
      name: "month",
      label: "One Month",
      range: moment.duration(1, "month"),
      increment: "hour",
      step: moment.duration(1, "hours"),
      headers: ["Date", "Time"],
      values: [(v) => v.split(" ")[0], (v) => v.split(" ")[1]],
      buildBin: (timestamp) => {
        const date = moment(timestamp);
        return `${date.format("YYYY-MM-DD HH:00")}-${date
          .add(1, "hours")
          .format("HH:00")}`;
      },
      binToDate: (bin) => moment(bin, "YYYY-MM-DD HH:00"),
      groupEntries: groupEntries,
    },
    // disabled to faciliate having both a dashboard and detailed view
    // {
    //   name: "month-by-day",
    //   label: "One Month by Day",
    //   range: moment.duration(1, "months"),
    //   increment: "day",
    //   step: moment.duration(1, "days"),
    //   headers: ["Date"],
    //   values: [(v) => v],
    //   buildBin: (timestamp) => moment(timestamp).format("YYYY-MM-DD"),
    //   binToDate: (bin) => moment(bin, "YYYY-MM-DD"),
    //   groupEntries: (e) => e,
    // },
    // {
    //   name: "year-by-week",
    //   label: "One Year by Week",
    //   range: moment.duration(1, "years"),
    //   increment: "week",
    //   step: moment.duration(1, "weeks"),
    //   headers: ["Year", "Week"],
    //   values: [(v) => v.split("-")[0], (v) => v.split("-")[1]],
    //   buildBin: (timestamp) => moment(timestamp).format("YYYY-WW"),
    //   binToDate: (bin) => moment(bin, "YYYY-WW"),
    //   groupEntries: (e) => e,
    // },
  ],
  parse: function(value) {
    if (_.isNumber(value)) {
      return this.values[value];
    }
    value = _.isString(value) ? value.toLowerCase() : value;
    return this.values.find(
      (operation) =>
        operation.name === value || operation.label.toLowerCase() === value
    );
  },
};
