// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import certificationArtifact from '../../build/contracts/Certification.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)
const Certification = contract(certificationArtifact)
let cer

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    // MetaCoin.setProvider(web3.currentProvider)
    Certification.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      console.log('测试地址:' + account)

      // self.refreshBalance()
    })

    Certification.deployed()
      .then(function (instance) {
        cer = instance
      })
      .catch(function (e) {
        console.log(e, null)
      })
  },

  showComponent: function (id) {
    let components = {
      add: document.getElementById('component:add'),
      search: document.getElementById('component:search')
    }

    for (let key in components) {
      components[key].style.display = key === id ? 'block' : 'none'
    }
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed()
      .then(function (instance) {
        meta = instance
        return meta.getBalance.call(account, { from: account })
      })
      .then(function (value) {
        const balanceElement = document.getElementById('balance')
        balanceElement.innerHTML = value.valueOf()
      })
      .catch(function (e) {
        console.log(e)
        self.setStatus('Error getting balance; see log.')
      })
  },

  // sendCoin: function () {
  //   const self = this

  //   const amount = parseInt(document.getElementById('amount').value)
  //   const receiver = document.getElementById('receiver').value

  //   this.setStatus('Initiating transaction... (please wait)')

  //   let meta
  //   MetaCoin.deployed()
  //     .then(function (instance) {
  //       meta = instance
  //       return meta.sendCoin(receiver, amount, { from: account })
  //     })
  //     .then(function () {
  //       self.setStatus('Transaction complete!')
  //       self.refreshBalance()
  //     })
  //     .catch(function (e) {
  //       console.log(e)
  //       self.setStatus('Error sending coin; see log.')
  //     })
  // },

  addCert: function () {
    // const self =this
    let elementIDs = ['name', 'age', 'id', 'school', 'major', 'country', 'year', 'month', 'address']
    let validatePatterns = {
      age: {
        pattern: /^[1-9][0-9]$/,
        message: '年龄需在10岁和100岁之间'
      },
      id: {
        pattern: /^[0-9]{18}$/,
        message: '身份证需为18位数字'
      },
      address: {
        pattern: /^0x[0-9a-f]{40}/,
        message: '学生地址需为0x开头的40位16进制数字'
      }
    }
    let values = {}
    elementIDs.forEach(id => {
      values[id] = document.getElementById('add_' + id).value
      if (!values[id]) {
        alert(id + '不能为空')
        throw { message: 'invalid input' }
      }
      if (id in validatePatterns && !validatePatterns[id].pattern.test(values[id])) {
        alert(validatePatterns[id].message)
        throw { message: 'invalid input' }
      }
    })
    console.log(values)

    //
    console.log(values['address'])
    // cer.newStudent(values['address'],{from: account,gas: 3000000}).then(function(){
    //   cer.NewStudent(function(e,r){
    //     if (!e) {
    //       console.log(r)
    //       console.log(r.args)
    //       if (r.args.isSuccess === true) {
    //         window.App.setStatus('学生注册成功')
    //       } else {
    //         window.App.setStatus('该地址已经被注册')
    //       }
    //     } else {
    //       console.log(e)
    //     }
    //   })
    // })
    cer
      .saveDiploma(
        values['address'],
        values['name'],
        values['age'],
        values['id'],
        values['country'],
        values['school'],
        values['year'],
        values['month'],
        values['major'],
        { from: account, gas: 3000000 }
      )
      .then(function () {
        cer.SaveDiploma(function (e, r) {
          if (!e) {
            console.log(r)
            console.log(r.args)
            if (r.args.isSuccess === true) {
              alert('学历导入成功')
            } else {
              alert('学历导入失败')
            }
          } else {
            console.log(e)
          }
        })
      })
  },

  searchCert: function () {
    // todo: 查询认证
    let searchKeyword = document.getElementById('search_keyword').value
    console.log(searchKeyword)
    let validatePatterns = {
      address: {
        pattern: /^0x[0-9a-f]{40}/,
        message: '学生地址需为0x开头的40位16进制数字。'
      }
    }
    if (!searchKeyword) {
      return alert('地址不能为空。')
    }
    if (!validatePatterns['address'].pattern.test(searchKeyword)) {
      document.getElementById('search_keyword').value=""
      return alert(validatePatterns['address'].message)
    }
    //
    // let name
    // name = cer.getName(searchKeyword,{from:account,gas: 3000000})
    // console.log(name)
    var hasInfo = true
    cer.diploma
      .call(searchKeyword)
      .then(result => {
        let elementIDs = ['name', 'age', 'id', 'country', 'school', 'year', 'month', 'major','address']
        result.map((v, i) => {
          console.log(v.valueOf())
          document.getElementById('search_' + elementIDs[i]).innerText = v
          if (v.valueOf()==='') {
            hasInfo = false
          } else {
            document.getElementById('table:search').style.display = "table"
          }
        })
      }).then(function(){
        if(!hasInfo){
          alert('该地址没有认证的学历信息。')
          document.getElementById('table:search').style.display = "none"
          document.getElementById('search_keyword').value=""
    }
      })
      .catch(e => {
        console.warn(e)
      })

      

  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      " If you find that your accounts don't appear or you have 0 MetaCoin," +
      " ensure you've configured that source properly." +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      " You should remove this fallback when you deploy live, as it's inherently insecure." +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
