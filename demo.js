var obj = {
  func1: function() {
    console.log(this === obj);

    var fun2 = function() {
      console.log(this === obj);
    }

    fun2()
  }
}

obj.func1()