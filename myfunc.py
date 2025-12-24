# 格式化当前日期   和时间
import os,sys
from datetime import datetime
import time
import json
from typing import Any, Optional, Dict
from pathlib import Path
from threading import Lock
import threading
import subprocess


class ___ssClass():
    
    def __init__(self):
        # self.isRun=False    
        self.error_file_list=[]
        self.auto_save_time_minute=5
        self.ss_io_handle=None
        self.ss_tagtext=""
        self.scerr_tagtext=""
        self.b_flush_fover=True
        
        threading.Thread(target=self.auto_save,daemon=True).start()
        
    def flush_fover(self,v=True):
        self.b_flush_fover=v
        
    def add_log_file(self,file):
        try:
            f=open(file, mode='a', encoding="utf-8", errors=None)
            self.ss_io_handle=f
            return f
        except Exception as e:
            print(e," open error ",file)    
        
    def writelog(self,text):
        if self.ss_io_handle:
            self.ss_io_handle.write(text)    
            if self.b_flush_fover:
                self.ss_io_handle.flush()
        
    def writeErrorLog(self,text):
        for f in self.error_file_list:
            f.write(text)
            if self.b_flush_fover:
                f.flush()
  
    def saveNow(self):
        if self.ss_io_handle:
            self.ss_io_handle.flush()
            
        for f in self.error_file_list:
            f.flush()      
    def auto_save(self):
        while True:
            time.sleep(self.auto_save_time_minute*60)
            self.saveNow()
    
        
    def add_error_log_file(self,file):
        try:
            f=open(file, mode='a', encoding="utf-8", errors=None)
            self.error_file_list.append(f)
            return f
        except Exception as e:
            print(e," open error ",file)
            return None


ssClass=___ssClass()


def xacquire_lock(LOCK_FILE):
    import msvcrt
    
    os.makedirs(os.path.dirname(LOCK_FILE), exist_ok=True)
    lock = open(LOCK_FILE, "a+")

    try:
        msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
        print("获取锁成功：无其他实例")
        return lock
    except OSError:
        print("已有实例运行（锁文件被占用）")
        return None





def Xdelete_file(file):
    file_exitlockscreen =file
    try:
        # 执行删除操作（无返回值，成功则继续，失败则抛异常）
        os.remove(file_exitlockscreen)
        # 手动返回 True 表示删除成功（因为 os.remove 本身不返回成功标识）
        return True
    except FileNotFoundError:
        print(f"文件 {file_exitlockscreen} 不存在")
        return False  # 文件不存在，返回失败
    except PermissionError:
        print(f"无权限删除文件 {file_exitlockscreen}")
        return False  # 权限不足，返回失败
    except Exception as e:
        print(f"删除失败：{e}")
        return False







def  __xRegister_hotkeys():
    def register_hotkeys2():
        import keyboard
        try:
            keyboard.add_hotkey('alt+1', lambda:Gfunction.mainaddtask(vvv,"alt+1"), suppress=True)
            keyboard.add_hotkey('alt+2', lambda:Gfunction.mainaddtask(vvv,"alt+2"), suppress=True)
            keyboard.add_hotkey('alt+3', lambda:Gfunction.mainaddtask(vvv,"alt+3"), suppress=True)
            keyboard.wait('esc')  # 按 Esc 退出
        except Exception as e:
            Gfunction.mainaddtask(ui.scerrMsg(f"热键注册失败！{e}"))
            pass



def  __xRegister_hotkeys():
    from pynput import keyboard
    # 定义热键回调函数（按下热键时执行）
    def on_hotkey_press():
        print("热键 Ctrl+Alt+Q 被触发！")

    def on_hotkey_exit():
        print("热键 Esc 被触发，退出程序！")
        # 停止监听
        return False
    # 创建热键监听器
    def register_hotkeys():
        # 修复：单键 esc 必须写成 <esc>，组合键正常
        hotkeys = {
            '<ctrl>+<alt>+q': on_hotkey_press,  # 组合键（修饰键+字母）
            '<esc>': on_hotkey_exit             # 单功能键（必须加<>）
        }
        # 初始化监听器
        with keyboard.GlobalHotKeys(hotkeys) as listener:
            print("热键已注册，按 Ctrl+Alt+Q 测试，按 Esc 退出...")
            listener.join()  # 阻塞监听








def xGetMinutesDifference(time_str1, time_str2, errorValue=0):
    """
    计算两个时间字符串相差的分钟数
    
    参数:
        time_str1, time_str2 : 时间字符串，格式 "%Y-%m-%d %H:%M:%S"
        errorValue : 出错时返回的默认值

    返回:
        两个时间的绝对分钟差
    """
    try:
        # 转换为 datetime 对象
        time1 = datetime.strptime(time_str1, "%Y-%m-%d %H:%M:%S")
        time2 = datetime.strptime(time_str2, "%Y-%m-%d %H:%M:%S")

        # 计算时间差（单位：秒）
        time_diff_seconds = (time2 - time1).total_seconds()

        # 转换为分钟（1分钟 = 60秒）
        time_diff_minutes = time_diff_seconds / 60
        return abs(time_diff_minutes)

    except Exception as e:
        print("计算分钟差出错:", e)
        return errorValue



def xQMessageBox(parent, title, message, msg_type="info"):
    from PyQt5.QtWidgets import QApplication
    app=QApplication(sys.argv)
    sys.path.append(r"A:\Mydoc\WORKS\python\pythonlib")
    from ModernMessageBox import ModernMessageBox
    a= ModernMessageBox.information(parent, title, message)
    return a
    
def loadjsonstr(jsonstr ,default=None):
        try:
            return json.loads(jsonstr)
        except Exception as e:
            print(e,"#551665")
            return default
        
        
def xJsonToStr(js):
    try:
        return json.dumps(js)
    except Exception as e:
        print(e,"#551234665")
        return None


def xLoadjsonstr(jsonstr ,default=None):
        try:
            return json.loads(jsonstr)
        except Exception as e:
            print(e,"#5512665")
            return default
  
def xLoadjsonFile(f ,default=None):
        try:
            return json.loads(xReadFileStr(f))
        except Exception as e:
            print(e,"#5516652")
            return default

# 配套的JSON保存函数
def xSavejsonFile(f, data, indent=4, ensure_ascii=False):
    """
    安全保存数据到JSON文件
    参数：
        f: 文件路径（字符串）
        data: 要保存的数据（必须是JSON可序列化类型：dict、list、str、int、float、bool、None）
        default: 保存失败时返回的默认值（默认None）
        indent: JSON格式化缩进（默认4空格，0为紧凑格式）
        ensure_ascii: 是否强制ASCII编码（默认False，支持中文等特殊字符）
    返回：
        保存成功返回True，失败返回default
    """
    try:
        # 先将数据序列化为JSON字符串（提前捕获序列化错误）
        json_str = json.dumps(
            data,
            indent=indent,
            ensure_ascii=ensure_ascii,
            sort_keys=False  # 是否按key排序，False保持原有顺序
        )
        # 写入文件（使用UTF-8编码，兼容中文）
        with open(f, 'w', encoding='utf-8') as file:
            file.write(json_str)
        print(f"JSON文件保存成功：{f}")
        return True
    except TypeError as e:
        # 数据不可序列化（比如包含datetime、自定义对象等）
        print(f"JSON序列化失败：数据类型不支持 - {e} #5516653")
        return False
    except IOError as e:
        # 文件操作错误（权限不足、路径不存在等）
        print(f"文件写入失败：{e} #5516654")
        return False
    except Exception as e:
        # 其他未知错误
        print(f"JSON保存异常：{e} #5516655")
        return False

              

class IniConfig2:
    def __init__(self,file=None,defaultSection="Default"):
        self.data = {}
        self.defaultSection = defaultSection
        self.loadFromFile_filename = None
        if file is not None:
            self.loadFromFile(file,defaultSection)
    
    def setDefaultSection(self, section):
        """设置默认section"""
        # 如果section不存在或不是字典，创建一个空字典作为该section
        if section not in self.data or not isinstance(self.data[section], dict):
            self.data[section] = {}
        
        # 设置默认section
        self.defaultSection = section
        return True
    
    def loadFromFile(self, filename, defaultSection="Default"):
        """从文件加载INI配置"""
        import os
        from configparser import ConfigParser
        
        # 如果文件不存在，创建空文件
        if not os.path.exists(filename):
            try:
                with open(filename, 'w', encoding='utf-8',errors='ignore') as f:
                    pass
            except IOError as e:
                print(f"创建配置文件失败：{e}")
                return False
        
        try:
            config = ConfigParser()
            config.optionxform = str
            config.read(filename, encoding='utf-8')
            
            # 转换为字典格式
            self.data = {}
            
            # 处理顶层键值对（DEFAULT section）
            if config.defaults():
                for key, value in config.defaults().items():
                    self.data[key] = value
            
            # 处理各个section
            for section in config.sections():
                self.data[section] = {}
                for key, value in config.items(section):
                    # 跳过从DEFAULT继承的键
                    if key not in config.defaults():
                        self.data[section][key] = value
                    else:
                        self.data[section][key] = value
            
            self.loadFromFile_filename = filename
            
            if defaultSection is not None:
                self.setDefaultSection(defaultSection)
            
            return True
            
        except Exception as e:
            print(f"加载配置文件失败:{e}")
            return False
    
    def loadFromString(self, iniString):
        """从字符串加载INI配置"""
        from configparser import ConfigParser
        
        try:
            config = ConfigParser()
            config.optionxform = str
            config.read_string(iniString)
            
            # 转换为字典格式
            self.data = {}
            
            # 处理顶层键值对
            if config.defaults():
                for key, value in config.defaults().items():
                    self.data[key] = value
            
            # 处理各个section
            for section in config.sections():
                self.data[section] = {}
                for key, value in config.items(section):
                    if key not in config.defaults():
                        self.data[section][key] = value
                    else:
                        self.data[section][key] = value
            
            return True
            
        except Exception:
            return False
    
    def get(self, key, default=None):
        """从默认section获取值"""
        # 确保节存在且为字典
        if self.defaultSection not in self.data or not isinstance(self.data[self.defaultSection], dict):
            return default
        
        return self.data[self.defaultSection].get(key, default)
    
    def getX(self, section, key, default=None):
        """从指定section获取值"""
        if section not in self.data or not isinstance(self.data[section], dict):
            return default
        
        return self.data[section].get(key, default)
    
    def set(self, key, value):
        """在默认section设置值"""
        if(key==None or key==""):return False
        
        
        # ss("key==",key,"value==",value)
        # 确保默认section存在
        if self.defaultSection not in self.data:
            self.data[self.defaultSection] = {}
        
        self.data[self.defaultSection][key] = value
        
        # 如果已加载文件，自动保存
        if self.loadFromFile_filename is not None:
            return self.saveToFile(self.loadFromFile_filename)
        
        return True
    
    def setX(self, section, key, value):
        """在指定section设置值"""
        # 确保节存在且为字典
        if(key==None or key==""):return False
        
        if section not in self.data or not isinstance(self.data[section], dict):
            self.data[section] = {}
        
        # 处理布尔值
        if isinstance(value, bool):
            value = 'true' if value else 'false'
        
        self.data[section][key] = value
        
        # 如果已加载文件，自动保存
        if self.loadFromFile_filename is not None:
            return self.saveToFile(self.loadFromFile_filename)
        
        return True
    
    def hasKey(self, section, key):
        """检查指定section中是否存在某个key"""
        # 检查节是否存在且是字典
        if section not in self.data or not isinstance(self.data[section], dict):
            return False
        
        # 检查键是否存在于节中
        return key in self.data[section]
    
    def saveToFile(self, filename):
        """保存到文件"""
        try:
            content = self.buildIniString(self.data)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except IOError:
            return False
    
    def buildIniString(self, data):
        """构建INI格式字符串"""
        content = ''
        
        # 首先写入顶层键值对（非section的键）
        top_level_keys = [k for k, v in data.items() if not isinstance(v, dict)]
        for key in top_level_keys:
            content += f"{key} = {data[key]}\n"
        
        # 然后写入各个section
        for section, values in data.items():
            if not isinstance(values, dict):
                continue
            
            content += f"\n[{section}]\n"
            for k, v in values.items():
                content += f"{k} = {v}\n"
        
        return content
 
    

def xReadFileline(file,Strip=False):
    try:
        with open(file, "r", encoding="utf-8") as f:
            line = f.readline().rstrip('\n')  # 仅去除末尾换行符（保留行内空格）
            if Strip:
                line = line.strip()
            # line = f.readline().strip()  # 去除首尾所有空白（空格、制表符、换行符等）
            return line
    except Exception as e:
        print(f"读取文件时发生错误：{e}")
        return None


def xWriteFileStr(filename, str_,encoding="utf-8"):
    try:
        with open(filename, 'w', encoding=encoding ,errors='ignore') as f:  # 打开文件，以写入模式
            f.write(str_)  # 写入内容
        return True  # 写入成功，返回True
    except Exception as e:  # 捕获异常
        print(f"写入文件时发生错误：{e}")  # 打印错误信息
        return False  # 写入失败，返回False
    
    
    
    
def getScriptExecPath(file=""):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)),file)
    
    
def xGetScriptExecPath(file=""):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)),file)
    
    
    
def xLockfile__(file_path):
    import msvcrt
    fd = os.open(file_path, os.O_RDWR | os.O_CREAT)
    try:
        # 锁住整个文件
        msvcrt.locking(fd, msvcrt.LK_NBLCK, os.path.getsize(file_path) or 1)
        
        with os.fdopen(fd, "r+") as f:
            f.write("独占写入内容\n")
            f.flush()
            return True
            

    except PermissionError as e:
        print("权限错误:", e)
        return False

    finally:
        # 解锁文件
        try:
            msvcrt.locking(fd, msvcrt.LK_UNLCK, os.path.getsize(file_path) or 1)
        except:
            pass
        os.close(fd)


def xLockfile(file_path):
    import msvcrt

    fd = os.open(file_path, os.O_RDWR | os.O_CREAT)
    try:
        # 文件长度，如果为 0，至少锁定 1 字节
        file_size = os.path.getsize(file_path)
        lock_len = file_size if file_size > 0 else 1

        # 锁住整个文件
        msvcrt.locking(fd, msvcrt.LK_NBLCK, lock_len)
        
        with os.fdopen(fd, "r+") as f:
            f.write("独占写入内容\n")
            f.flush()
            return True

    except PermissionError as e:
        print("权限错误:", e)
        return False

    finally:
        # 解锁文件
        try:
            msvcrt.locking(fd, msvcrt.LK_UNLCK, lock_len)
        except:
            pass
        os.close(fd)

    
def xWriteFileStr_add(filename, str,encoding="utf-8"):
    import portalocker

    with open(filename, 'a', encoding=encoding) as f:  # 'a' 表示追加模式
        portalocker.lock(f, portalocker.LOCK_EX)  # 获得独占锁（阻塞）
        f.write(str)
        f.flush()  # 确保写入磁盘
        return True
    
    
    
def xWriteFileStr_add_unlock(filename, text,encoding="utf-8"):
    try:
        with open(filename, 'a', encoding=encoding) as f:  # 'a' 表示追加模式
            f.write(text)
            f.flush()  # 确保写入磁盘
            return True
    except Exception as e:
        print(f"写入文件时发生错误：{e}")
        return False

        

        

    
    
def xLockFile(filename):
    import portalocker
    file = open(filename, 'a')
    
    if not hasattr(xLockFile, "persistent_vars"):
        xLockFile.persistent_vars = {
            "last_file": None,
            "lock_success": False,
            "error_info": None
        }
    
    
    try:
        # 获取文件的独占锁（如果锁被占用会阻塞等待）
        portalocker.lock(file, portalocker.LOCK_EX| portalocker.LOCK_NB)
        xLockFile.persistent_vars["last_file"] = file
    
        # 执行到这里表示成功获取锁，返回True
        return file
    except Exception as e:
            print(e)
        # 确保文件在操作完成后关闭（据实际需求，也可在其他地方关闭）
            file.close()
            return None




















































class IniConfig:
    def __init__(self, file=None, defaultSection="Default"):
        self.data = {}
        self.defaultSection = defaultSection
        self.loadFromFile_filename = None
        if file is not None:
            self.loadFromFile(file, defaultSection)
    
    def setDefaultSection(self, section):
        """设置默认section"""
        # 如果section不存在或不是字典，创建一个空字典作为该section
        if section not in self.data or not isinstance(self.data[section], dict):
            self.data[section] = {}
        
        # 设置默认section
        self.defaultSection = section
        return True
    
    def loadFromFile(self, filename, defaultSection="Default"):
        """从文件加载INI配置"""
        import os
        from configparser import ConfigParser
        
        # 如果文件不存在，创建空文件
        if not os.path.exists(filename):
            try:
                with open(filename, 'w', encoding='utf-8', errors='ignore') as f:
                    pass
            except IOError as e:
                print(f"创建配置文件失败：{e}")
                return False
        
        try:
            config = ConfigParser()
            config.optionxform = str
            config.read(filename, encoding='utf-8')
            
            # 转换为字典格式
            self.data = {}
            
            # 处理顶层键值对（DEFAULT section）
            if config.defaults():
                for key, value in config.defaults().items():
                    self.data[key] = value
            
            # 处理各个section
            for section in config.sections():
                self.data[section] = {}
                for key, value in config.items(section):
                    # 跳过从DEFAULT继承的键
                    if key not in config.defaults():
                        self.data[section][key] = value
                    else:
                        self.data[section][key] = value
            
            self.loadFromFile_filename = filename
            
            if defaultSection is not None:
                self.setDefaultSection(defaultSection)
            
            return True
            
        except Exception as e:
            print(f"加载配置文件失败:{e}")
            return False
    
    def loadFromString(self, iniString):
        """从字符串加载INI配置"""
        from configparser import ConfigParser
        
        try:
            config = ConfigParser()
            config.optionxform = str
            config.read_string(iniString)
            
            # 转换为字典格式
            self.data = {}
            
            # 处理顶层键值对
            if config.defaults():
                for key, value in config.defaults().items():
                    self.data[key] = value
            
            # 处理各个section
            for section in config.sections():
                self.data[section] = {}
                for key, value in config.items(section):
                    if key not in config.defaults():
                        self.data[section][key] = value
                    else:
                        self.data[section][key] = value
            
            return True
            
        except Exception:
            return False
    
    def get(self, key, default=None):
        """从默认section获取值"""
        # 确保节存在且为字典
        if self.defaultSection not in self.data or not isinstance(self.data[self.defaultSection], dict):
            return default
        
        return self.data[self.defaultSection].get(key, default)
    
    def getX(self, section, key, default=None):
        """从指定section获取值"""
        if section not in self.data or not isinstance(self.data[section], dict):
            return default
        
        return self.data[section].get(key, default)
    
    def set(self, key, value):
        """在默认section设置值"""
        if key == None or key == "":
            return False
        
        # 确保默认section存在
        if self.defaultSection not in self.data:
            self.data[self.defaultSection] = {}
        
        self.data[self.defaultSection][key] = value
        
        # 如果已加载文件，自动保存
        if self.loadFromFile_filename is not None:
            return self.saveToFile(self.loadFromFile_filename)
        
        return True
    
    def setX(self, section, key, value):
        """在指定section设置值"""
        # 确保节存在且为字典
        if key == None or key == "":
            return False
        
        if section not in self.data or not isinstance(self.data[section], dict):
            self.data[section] = {}
        
        # 处理布尔值
        if isinstance(value, bool):
            value = 'true' if value else 'false'
        
        self.data[section][key] = value
        
        # 如果已加载文件，自动保存
        if self.loadFromFile_filename is not None:
            return self.saveToFile(self.loadFromFile_filename)
        
        return True
    
    def hasKey(self, section, key):
        """检查指定section中是否存在某个key"""
        # 检查节是否存在且是字典
        if section not in self.data or not isinstance(self.data[section], dict):
            return False
        
        # 检查键是否存在于节中
        return key in self.data[section]
    
    def saveToFile(self, filename):
        """保存到文件"""
        try:
            content = self.buildIniString(self.data)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except IOError:
            return False
    
    def buildIniString(self, data):
        """构建INI格式字符串"""
        content = ''
        
        def sanitize_value(value):
            """清理和转换值，使其适合INI格式"""
            # 处理None值
            if value is None:
                return ''
            
            # 转换为字符串
            value_str = str(value)
            
            # 替换换行符为空格（推荐）
            value_str = value_str.replace('\r\n', ' ').replace('\n', ' ').replace('\r', ' ')
            
            # 方案2：如果需要保留换行，可以转义（取消下面注释）
            # value_str = value_str.replace('\r\n', '\\n').replace('\n', '\\n').replace('\r', '\\n')
            
            # 移除首尾空格
            value_str = value_str.strip()
            
            return value_str
        
        def sanitize_key(key):
            """清理key，确保符合INI格式"""
            if key is None:
                return None
            
            key_str = str(key)
            
            # key中不应该有换行符、等号等特殊字符
            key_str = key_str.replace('\r\n', '_').replace('\n', '_').replace('\r', '_')
            key_str = key_str.replace('=', '_').replace('[', '_').replace(']', '_')
            key_str = key_str.strip()
            
            # 如果key为空，返回None表示跳过
            if not key_str:
                return None
            
            return key_str
        
        # 首先写入顶层键值对（非section的键）
        top_level_keys = [k for k, v in data.items() if not isinstance(v, dict)]
        for key in top_level_keys:
            clean_key = sanitize_key(key)
            if clean_key is None:
                continue
            
            clean_value = sanitize_value(data[key])
            content += f"{clean_key} = {clean_value}\n"
        
        # 如果有顶层键值对，添加一个空行分隔
        if top_level_keys:
            content += '\n'
        
        # 然后写入各个section
        first_section = True
        for section, values in data.items():
            if not isinstance(values, dict):
                continue
            
            # section名称也需要清理
            clean_section = sanitize_key(section)
            if clean_section is None:
                continue
            
            # 非第一个section前添加空行
            if not first_section:
                content += '\n'
            first_section = False
            
            content += f"[{clean_section}]\n"
            
            for k, v in values.items():
                clean_key = sanitize_key(k)
                if clean_key is None:
                    continue
                
                clean_value = sanitize_value(v)
                content += f"{clean_key} = {clean_value}\n"
        
        return content





def xLockFile2(filename):
    import portalocker
    
    try:
        file = open(filename, 'a', encoding='utf-8')
        portalocker.lock(file, portalocker.LOCK_EX)  # 获取独占锁
        file.write("aaaaa\n")
        file.flush()  # 确保写入磁盘
        # 返回文件对象，调用者必须负责关闭和解锁
        return file
    except Exception as e:
        # 如果出错，确保文件被关闭
        try:
            file.close()
        except:
            pass
        return None

    
def xIsThisProcessRunning(configFileName,restart=False):
    import psutil
    
    ini=IniConfig()
    if(ini.loadFromFile(getScriptExecPath(configFileName))==False):
        xMessageBox("错误", "加载配置文件失败")
        os.exit(0)
         
    pid =int(ini.get("pid","0"))
    pid_create_time=ini.get("pid_create_time","")

    try:
        # 检查PID是否存在（不抛出异常即存在）
        ps=psutil.Process(pid)
        ps.create_time()
        if str( ps.create_time())==pid_create_time:
            jg= True
        else:
            ss("pid 存在,但不是当前进程,时间 不同")
            jg= False
    except Exception as e:
        jg=False
    
      
    if jg==False:
        ps=psutil.Process(os.getpid())
        ini.set("pid_create_time",str( ps.create_time()))
        ini.set("pid",os.getpid())



    if jg==True:
        if restart==True:
            xProcessterminate(pid)
            print("选择重启终止:",pid)
            return jg
            
        
        
        import platform
        system = platform.system()
        if system == "Linux":
            ss("进程已经启动,点击终止")
            ww=input("输入1终止")
            if ww=="1":
                xProcessterminate(pid)
            os._exit(0)

          
         
        if xMessageBox("错误", "进程已经启动,点击终止",4096+1)==1:
            xProcessterminate(pid)
        os._exit(0)

    return jg
    
    
     
     
def xGetScreenSize():
    import ctypes
    user32 = ctypes.windll.user32
    user32.SetProcessDPIAware()  # 防止高分辨率下缩放影响
    width = user32.GetSystemMetrics(0)
    height = user32.GetSystemMetrics(1)
    return width, height

     
 
    
def  pyperclip_copy(str):
    import pyperclip
    # 设置剪贴板内容（将字符串复制到剪贴板）
    pyperclip.copy(str)
    
def xExec(exe,cmd):
    import psutil
    
    """
    运行 PHP 脚本并返回进程对象
    :param script_path: PHP 脚本的绝对路径
    :return: psutil.Process 对象
    """
    try:
        # 使用 subprocess.Popen 启动 PHP 进程
        # 命令格式：php 脚本路径
        proc = subprocess.Popen(
            [exe, cmd],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # 输出为字符串（而非字节）
        )
        
        # 转换为 psutil.Process 对象（便于后续管理）
        php_process = psutil.Process(proc.pid)
        print(f"PHP 进程已启动，PID: {php_process.pid}")
        return php_process
    
    except FileNotFoundError:
        print("错误：未找到 PHP 解释器，请确保 PHP 已安装并添加到环境变量")
        return None
    except Exception as e:
        print(f"启动 PHP 进程失败：{str(e)}")
        return None



def xQInputDialog(parent=None, title1="Input", label="Enter your name:", text="",notexec_QApplication=False):
    """
    return text or None
    """
    from PyQt5.QtWidgets import QApplication, QInputDialog,QLineEdit
    if notexec_QApplication==False:
        app = QApplication([])
    text, ok = QInputDialog.getText(parent, title1, label,QLineEdit.Normal,text)
    if ok:
        return text
    else:
        return None
    
    
def xQFileDialog22(parent=None,directory="",filter="所有文件 (*);;文本文件 (*.txt);"):
    from PyQt5.QtWidgets import QFileDialog
    # 方法1: 简单版本
    file_path, _ = QFileDialog.getOpenFileName(
        parent=parent,  # 父窗口
        caption="选择文件",  # 对话框标题
        directory=directory,  # 初始目录,空字符串表示当前目录
        filter=filter
    )

    if file_path:
        return file_path
    
    return None
def xQFileDialog(parent=None, directory="", filter="所有文件 (*);;文本文件 (*.txt)", multiple=False):
    from PyQt5.QtWidgets import QFileDialog
    
    if multiple:
        # 多选文件
        file_paths, _ = QFileDialog.getOpenFileNames(
            parent=parent,
            caption="选择文件",
            directory=directory,
            filter=filter
        )
        return file_paths if file_paths else None
    else:
        # 单选文件
        file_path, _ = QFileDialog.getOpenFileName(
            parent=parent,
            caption="选择文件",
            directory=directory,
            filter=filter
        )
        return file_path if file_path else None
    
    
def xChoose_directory(parent=None, directory=""):
    from PyQt5.QtWidgets import  QFileDialog
    # 父窗口 self, 对话框标题, 默认目录
    directory2 = QFileDialog.getExistingDirectory(
        parent,
        "请选择目录",
        directory  # 默认路径，可以改成其他
    )
    return directory2

    
    
    
def xIsmycomputer():
    # if os.path.exists(r"/data/data/com.termux/files/home/device_id.txt"):
    #     return True
    
    return os.path.exists(r"A:\APP\Flux\flux.exe")

    
def xRun_command_old(cmd: str, check_output = False) :
    """
    执行shell命令
    :param cmd: 命令字符串
    :param check_output: 是否返回输出内容
    :return: (返回码, 输出内容)
    """
    import subprocess
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        output = result.stdout.strip() if check_output else ""
        return result.returncode, output
    except subprocess.TimeoutExpired:
        print(f"命令执行超时: {cmd}", True)
        return -1, ""
    except Exception as e:
        print(f"命令执行异常: {str(e)}", True)
        return -1, "" 

    
    
def xHours_to_seconds(hours):
    """
    将小时转换为秒（支持整数/浮点数小时）
    :param hours: 小时数（如 1.5 表示1小时30分钟）
    :return: 转换后的秒数
    """
    if not isinstance(hours, (int, float)):
        raise TypeError("小时数必须是整数或浮点数")
    if hours < 0:
        raise ValueError("小时数不能为负数")
    return hours * 3600  # 1小时=3600秒

def xMinutes_to_seconds(minutes):
    """
    将分钟转换为秒（支持整数/浮点数，如 1.5 分钟=90秒）
    :param minutes: 分钟数（正数）
    :return: 转换后的秒数
    """
    # 参数合法性校验
    if not isinstance(minutes, (int, float)):
        raise TypeError("分钟数必须是整数或浮点数（如 5、2.5）")
    if minutes < 0:
        raise ValueError("分钟数不能为负数")
    # 核心转换：1分钟=60秒
    return minutes * 60




def XMinutes_to_milliseconds(minutes):
    """
    将分钟转换为毫秒（支持小数分钟，如 0.5分钟=30000毫秒）
    :param minutes: 分钟数（正数，整数/浮点数）
    :return: 转换后的毫秒数
    """
    # 参数合法性校验
    if not isinstance(minutes, (int, float)):
        raise TypeError("分钟数必须是整数或浮点数（如 5、2.5）")
    if minutes < 0:
        raise ValueError("分钟数不能为负数")
    # 核心转换：1分钟 = 60秒 = 60×1000=60000毫秒
    return minutes * 60 * 1000

def XSeconds_to_milliseconds(seconds):
    """
    将秒转换为毫秒（支持小数秒，如 0.5秒=500毫秒）
    :param seconds: 秒数（正数，整数/浮点数）
    :return: 转换后的毫秒数
    """
    # 参数合法性校验
    if not isinstance(seconds, (int, float)):
        raise TypeError("秒数必须是整数或浮点数（如 5、2.5）")
    if seconds < 0:
        raise ValueError("秒数不能为负数")
    # 核心转换：1秒 = 1000毫秒
    return seconds * 1000


def xRun_command(cmd: str, check_output: bool = True, timeout: int = 30,returnErrorText=False):
    """
    执行 shell 命令
    :param cmd: 命令字符串
    :param check_output: 是否返回输出内容
    :param timeout: 超时时间（秒）
    :return: (返回码, 输出内容)
    """
    import subprocess
    
    try:
        # 使用 Popen 读取输出，兼容任意编码
        proc = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        try:
            out_bytes, err_bytes = proc.communicate(timeout=timeout)
        except subprocess.TimeoutExpired:
            proc.kill()
            out_bytes, err_bytes = proc.communicate()
            print(f"[ERROR] 命令执行超时: {cmd}")
            return -1, ""

        # 尝试用 utf-8 解码，无法解码的忽略
        stdout = out_bytes.decode("utf-8", errors="ignore").strip() if check_output else ""
        stderr = err_bytes.decode("utf-8", errors="ignore").strip()

        if proc.returncode != 0 and stderr:
            print(f"[ERROR] 命令执行异常: {stderr}")
            if returnErrorText:
                return proc.returncode, stderr

        return proc.returncode, stdout

    except Exception as e:
        print(f"[EXCEPTION] 命令执行异常: {str(e)}")
        return -1, ""

    
    
    
    
def xProcessterminate(pid):
    import psutil
    psutil.Process(pid).terminate()
    
    

def xIsProcessRunning(pid):
    import psutil
    """判断指定PID的进程是否存在"""
    try:
        # 检查PID是否存在（不抛出异常即存在）
        return psutil.pid_exists(pid)
    except Exception:
        return False
    
def xMessageBox(title="", message="", style=4096):
    import ctypes
    import ctypes.wintypes
    """
    使用WinAPI显示信息框
    
    参数:
        title: 信息框标题
        message: 要显示的消息内容
        style: 信息框样式，默认为0（MB_OK）
        
    样式可选值:
        MB_OK = 0x00000000L
        MB_OKCANCEL = 0x00000001L
        MB_ABORTRETRYIGNORE = 0x00000002L
        MB_YESNOCANCEL = 0x00000003L
        MB_YESNO = 0x00000004L
        MB_RETRYCANCEL = 0x00000005L
    """
    # 加载user32.dll
    user32 = ctypes.WinDLL('user32', use_last_error=True)
    
    # 定义MessageBox函数的参数和返回值类型
    user32.MessageBoxW.argtypes = (
        ctypes.wintypes.HWND,  # hWnd
        ctypes.wintypes.LPCWSTR,  # lpText
        ctypes.wintypes.LPCWSTR,  # lpCaption
        ctypes.wintypes.UINT  # uType
    )
    user32.MessageBoxW.restype = ctypes.wintypes.INT
    
    # 调用MessageBox函数
    result = user32.MessageBoxW(None, message, title, style)
    return result

        
def xMessageBoxEx(title="", message="", style=0, icon=None):
    import ctypes
    import ctypes.wintypes
    """
    使用WinAPI显示信息框（支持错误图标等样式）
    
    参数:
        title: 信息框标题
        message: 要显示的消息内容
        style: 信息框按钮样式，默认为0（MB_OK）
        icon: 信息框图标样式，可选值：'error'（错误）、'info'（信息）、'warning'（警告）、'question'（疑问）、None（无图标）
        
    按钮样式可选值:
        MB_OK = 0x00000000L          # 只有"确定"按钮
        MB_OKCANCEL = 0x00000001L    # "确定"和"取消"按钮
        MB_ABORTRETRYIGNORE = 0x00000002L  # "中止"、"重试"、"忽略"按钮
        MB_YESNOCANCEL = 0x00000003L        # "是"、"否"、"取消"按钮
        MB_YESNO = 0x00000004L       # "是"和"否"按钮
        MB_RETRYCANCEL = 0x00000005L # "重试"和"取消"按钮
        
    图标样式说明:
        'error'   - 红色叉号（错误图标）
        'info'    - 蓝色圆圈i（信息图标）
        'warning' - 黄色三角形！（警告图标）
        'question'- 蓝色问号（疑问图标）
    """
    # 图标样式常量定义（Windows API标准值）
    ICON_MAP = {
        'error': 0x00000010,    # MB_ICONERROR - 错误图标
        'info': 0x00000040,     # MB_ICONINFORMATION - 信息图标
        'warning': 0x00000030,  # MB_ICONWARNING - 警告图标
        'question': 0x00000020  # MB_ICONQUESTION - 疑问图标
    }
    
    # 组合按钮样式和图标样式（通过按位或运算）
    if icon in ICON_MAP:
        style |= ICON_MAP[icon]
    
    # 加载user32.dll
    user32 = ctypes.WinDLL('user32', use_last_error=True)
    
    # 定义MessageBox函数的参数和返回值类型
    user32.MessageBoxW.argtypes = (
        ctypes.wintypes.HWND,     # hWnd - 父窗口句柄（None表示无父窗口）
        ctypes.wintypes.LPCWSTR,  # lpText - 消息内容
        ctypes.wintypes.LPCWSTR,  # lpCaption - 窗口标题
        ctypes.wintypes.UINT      # uType - 组合后的样式（按钮+图标）
    )
    user32.MessageBoxW.restype = ctypes.wintypes.INT
    
    # 调用MessageBox函数（自动处理字符串编码为宽字符）
    result = user32.MessageBoxW(None, message, title, style)
    return result
    
    
def  pyperclip_paste():
    import pyperclip
    str1=pyperclip.paste()
    if isinstance(str1, str):
        return str1
    else:
        return ""
    

def list_files_in_directory(directory):
    """
    列出指定目录下的所有文件（不含子目录），返回文件名列表。
    """
    if not os.path.exists(directory):
        return None
        raise FileNotFoundError(f"目录不存在: {directory}")
    
    if not os.path.isdir(directory):
        return None
        raise NotADirectoryError(f"路径不是目录: {directory}")
    
    try:
        # 只保留文件，忽略子目录
        files = [f for f in os.listdir(directory) 
                 if os.path.isfile(os.path.join(directory, f))]
        return files
    except Exception as e:
        return None
        raise RuntimeError(f"列出文件时出错: {e}")
    
# def xWriteFileStr_add_lock(filename, str_,encoding="utf-8"):
#     try:
#         with open(filename, 'a', encoding=encoding,errors='ignore') as f:  # 打开文件，以写入模式
#             f.write(str_)  # 写入内容
#         return True  # 写入成功，返回True
#     except Exception as e:  # 捕获异常
#         print(f"写入文件时发生错误：{e}")  # 打印错误信息
#         return False  # 写入失败，返回False


file_xAppStartupNotify=r"A:\Mydoc\WORKS\python\启动通知\appstartupnotify.txt"
def xAppStartupNotify( message): 
    xWriteFileStr_add_unlock(file_xAppStartupNotify,xgetCurrentDateTime()+":"+message+"\n")
    
def xGetAppStartupNotify(): 
    return xReadFileStr(file_xAppStartupNotify)
def xDeleteAppStartupNotify(): 
    os.remove(file_xAppStartupNotify)


def blurred(input_path,output_path,ikernel_size):
    
    """路径不能有中文"""
    import cv2
    
    # 读取 JPG 图片
    kernel_size = (ikernel_size, ikernel_size)         # 高斯核大小，必须是奇数，如(15, 15)

    # 加载图像
    image = cv2.imread(input_path)
    # 检查是否成功读取
    if image is None:
        raise FileNotFoundError(f"无法读取图片，请检查路径是否正确: {input_path}")
    # 应用高斯模糊
    blurred_image = cv2.GaussianBlur(image, kernel_size, 0)

    # 保存结果
    success =cv2.imwrite(output_path, blurred_image)
    if success:
        #print(f"图像已成功保存到 {output_path}")
        return True
    else:
        return False
        print(f"图像保存失败，请检查输出路径: {output_path}")
        
            
    
def xGetTimeAsFile():
    from datetime import datetime
    # 获取当前时间
    now = datetime.now()

    # 手动格式化日期部分
    date_part = f"{now.year}-{now.month}-{now.day}"  # YYYY-M-D 格式

    # 手动格式化时间部分
    hour = now.hour
    minute = now.minute
    time_part = f"{hour}.{minute:02d}"  # H.MM 格式，分钟部分保留两位

    # 组合成最终格式
    formatted_time = f"{date_part} {time_part}"
    return formatted_time
    
def xWriteFileBin(filename, bin):
    try:
        with open(filename, 'wb') as f:  # 打开文件，以写入模式
            f.write(bin)  # 写入内容
        return True  # 写入成功，返回True
    except Exception as e:  # 捕获异常
        print(f"写入文件时发生错误：{e}")  # 打印错误信息
        return False  # 写入失败，返回False
    
def xReadFileStr(filename,defaulStr="",encoding='utf-8'):
    try:
        with open(filename, 'r', encoding=encoding,errors='ignore') as f:  # 打开文件，以读取模式
            content = f.read()  # 读取文件内容
        return content  # 读取成功，返回文件内容
    except Exception as e:  # 捕获异常
        print(f"读取文件时发生错误：{e}")  # 打印错误信息
        return defaulStr  # 读取失败，返回 None
    

    
import os

def pid_exists(pid: int) -> bool:
    """判断指定 PID 是否存在"""
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        # 没有这个进程
        return False
    except PermissionError:
        # 有这个进程，但没有权限操作
        return True
    else:
        return True


    
def xReadFileBin(filename):
    content=None
    try:
        with open(filename, 'rb') as f:  # 打开文件，以读取模式
            content = f.read()  # 读取文件内容
        return content  # 读取成功，返回文件内容
    except Exception as e:  # 捕获异常
        print(f"读取文件时发生错误：{e}")  # 打印错误信息
        return content  # 读取失败，返回 None
    
    
 
def xGetHoursDifference(time_str1,time_str2,errorValue=0):
    try:
    # 转换为 datetime 对象
        time1 = datetime.strptime(time_str1, "%Y-%m-%d %H:%M:%S")
        time2 = datetime.strptime(time_str2, "%Y-%m-%d %H:%M:%S")

        # 计算时间差（单位：秒）
        time_diff_seconds = (time2 - time1).total_seconds()

        # 转换为小时（1小时 = 3600秒）
        time_diff_hours = time_diff_seconds / 3600
        return abs(time_diff_hours)

    except Exception as e:
        print(e)
        return errorValue
    
    
    
def xgetCurrentDateTime(xtime=None):
    current_time = datetime.now()
    if xtime is not None:
        current_time = xtime
    return  current_time.strftime("%Y-%m-%d %H:%M:%S")
def xgetCurrentTime():
    current_time = datetime.now()
    return  current_time.strftime("%H:%M:%S")

def xaddMinutes(in_minutes):
    from datetime import datetime, timedelta
    # 获取当前时间
    current_time = datetime.now()
    #print("当前时间：", current_time)

    # 增加5分钟
    new_time = current_time + timedelta(minutes=in_minutes)
    formatted_new_time = new_time.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_new_time


def xGetRandomMd5():
    """根据当前时间获取md5"""
    import hashlib
    # 原始字符串
    text = xgetCurrentDateTime()
    # 创建MD5哈希对象
    md5_hash = hashlib.md5()

    # 更新哈希对象的内容（需要将字符串编码为字节）
    md5_hash.update(text.encode('utf-8'))
    # 获取16进制的哈希值
    return md5_hash.hexdigest()



def xparseHex(text):
    """被encode"""
    
    try:
        return bytes.fromhex(text).decode("utf-8")
    except Exception as ee:
        return ""
        import re

def xis_valid_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def xMinutes_to_seconds(minutes):
    """
    将分钟转换为秒
    :param minutes: 分钟数（整数或浮点数）
    :return: 秒数（整数或浮点数）
    """
    if isinstance(minutes, (int, float)) and minutes >= 0:  # 检查输入是否为非负的整数或浮点数
        return minutes * 60  # 将分钟转换为秒
    else:
        raise ValueError("输入的分钟数必须是非负的整数或浮点数")
    
    
def xFileToDict(file):
    """失败返回 空白 dict"""
    import json
    try:
        return dict(json.loads(xReadFileStr(file)))
        
    except Exception as pp:
        return {}
    
    
def xSaveDictToFile(xdict,file):
    import json
    try:
        result=json.dumps(xdict,ensure_ascii=False,indent=4)
        return xWriteFileStr(file,result)
    except Exception as fdddd:
        print(fdddd)
        return False
        
def xis_running_in_vscode():
    import os
    # 检查 VSCode 设置的环境变量
    return "VSCODE_NONCE" in os.environ or "VSCODE" in os.environ

    
    
def ss_printsavepath():
    pass    
        
_____xgetArgsParser_scCount=0
def __xgetArgsParser(args,red=None,NotImportantMsg=0,justReturnStr=False):
    global _____xgetArgsParser_scCount
    _____xgetArgsParser_scCount+=1
    
    text=""
    t=text+" -> ".join(map(str,args))
    t=t.replace("\n","\n\t")
    
    t=str(_____xgetArgsParser_scCount)+":"+t
    
    
    # if _____xgetArgsParser_showtime:
    t="["+xgetCurrentDateTime()+"]"+t
    
    
    if justReturnStr:
        return t
    
    if(NotImportantMsg==1):
        t="  ---"+t
    
    print(t)
    

def ss_set_notshowtime(t=True):
    pass

def scx(*xstr):
    __xgetArgsParser(xstr,1)
def sc(*xstr):
    __xgetArgsParser(xstr)
def scc(*xstr):
    """输出后退出"""
    __xgetArgsParser(xstr)
    os._exit(0)
    

def ss_set_savepath(savepath,showtime=True):
    ssClass.add_log_file(savepath)
    
        
def ss(*args):
    text=__xgetArgsParser(args,justReturnStr=True)
    if ssClass.ss_io_handle :
        ssClass.ss_io_handle.write(ssClass.ss_tagtext+ text+"\n")
        ssClass.ss_io_handle.flush()
    print(text)
    

    


def scerr_set_savepath(savepath,savepath2="",savepath3="",tagtext=""):
    
    files=[savepath,savepath2,savepath3]
    for f in files:
        if f:
            f=ssClass.add_error_log_file(f)
    ssClass.scerr_tagtext=tagtext       
        
    
def scerr(*args,savepath=None,savepath2=None,tagtext=""):
    text="【 ERROR 】 "+ssClass.scerr_tagtext+tagtext+__xgetArgsParser(args,justReturnStr=True)

    if savepath:
         xWriteFileStr_add_unlock(savepath,text+"\n")

    if savepath2:
         xWriteFileStr_add_unlock(savepath2,text+"\n")
         
    ssClass.writeErrorLog(text+"\n")
    print(text)

def ss_setFlag(flag=None):
    if not isinstance(flag,str):
        return
    ssClass.ss_tagtext=flag



def scNotImportant(*xstr):
    """前面+("\t")"""
    __xgetArgsParser(xstr,NotImportantMsg=1)





def xGetStrBetween(text, left, right, default=None):
    """
    在 text 中找到第一个 left 和其之后的第一个 right，返回它们之间的子串。
    如果找不到 left 或 right，返回 None。
    """
    if not text or not left or not right:
        return default

    left_idx = text.find(left)
    if left_idx == -1:
        return default

    start = left_idx + len(left)
    right_idx = text.find(right, start)
    if right_idx == -1:
        return default

    return text[start:right_idx]








































class FashJson:
    """
    一个用于处理 JSON 数据的便捷类,支持节点管理和自动保存功能
    """
    
    def __init__(self):
        """初始化 FashJson 实例"""
        self._data: Optional[Dict[str, Any]] = None
        self._file_path: Optional[Path] = None
        self._current_node: Optional[str] = None
        self._current_dict_node: Optional[dict] = None
        self._auto_save: bool = True
        self._prefix = "[FashJson]"
    
    @property
    def data(self) -> Optional[Dict[str, Any]]:
        """获取当前 JSON 数据"""
        return self._data
    
    @property
    def is_loaded(self) -> bool:
        """检查是否已加载数据"""
        return self._data is not None and isinstance(self._data, dict)
    
    def load_from_dict(self,data,node: str = "default"):
        try:
            if not isinstance(data, dict):
                print(f"{self._prefix} 错误: JSON 数据必须是字典类型")
                return False
            
            self._data = data
            self._ensure_node(node)
            self._current_node = node
            return True
        except json.JSONDecodeError as e:
            print(f"{self._prefix} JSON 解析错误: {e}")
            return False
        except Exception as e:
            print(f"{self._prefix} 加载字符串时出错: {e}")
            return False
 
 
        
    
    def load_from_string(self, json_str: str, node: str = "default") -> bool:
        """
        从 JSON 字符串加载数据
        
        Args:
            json_str: JSON 格式的字符串
            node: 默认工作节点名称
        Returns:
            bool: 加载成功返回 True,否则返回 False
        """
        try:
            data = json.loads(json_str)
            if not isinstance(data, dict):
                print(f"{self._prefix} 错误: JSON 数据必须是字典类型")
                return False
            
            self._data = data
            self._ensure_node(node)
            self._current_node = node
            return True
        except json.JSONDecodeError as e:
            print(f"{self._prefix} JSON 解析错误: {e}")
            return False
        except Exception as e:
            print(f"{self._prefix} 加载字符串时出错: {e}")
            return False
    
    def load_from_file(self, file_path: str, node: str = "default", 
                       auto_save: bool = True) -> bool:
        """
        从文件加载 JSON 数据
        
        Args:
            file_path: JSON 文件路径
            node: 默认工作节点名称
            auto_save: 是否启用自动保存
            
        Returns:
            bool: 加载成功返回 True,否则返回 False
        """
        try:
            path = Path(file_path)
            
            # 如果文件不存在,创建空 JSON 文件
            if not path.exists():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("{}", encoding="utf-8")
            
            if os.path.getsize(path) == 0:
                xWriteFileStr(path,"{}")
            
            # 读取文件内容
            with path.open("r", encoding="utf-8") as f:
                self._data = json.load(f)
            
            if not isinstance(self._data, dict):
                print(f"{self._prefix} 错误: JSON 数据必须是字典类型 只能是【】开始  不能以[]开始")
                self._data = None
                return False
            
            self._file_path = path
            self._auto_save = auto_save
            self._ensure_node(node)
            self._current_node = node
            return True
            
        except json.JSONDecodeError as e:
            print(f"{self._prefix} JSON 解析错误: {e}")
            return False
        except Exception as e:
            print(f"{self._prefix} 加载文件时出错: {e}")
            return False
    
    def _ensure_node(self, node: str) -> bool:
        """
        确保节点存在且为字典类型
        
        Args:
            node: 节点名称
            
        Returns:
            bool: 操作成功返回 True
        """
        if not self.is_loaded:
            return False
        
        if node not in self._data or not isinstance(self._data[node], dict):
            self._data[node] = {}
        
        return True
    
    def set_node(self, node) -> bool:
        """
        设置当前工作节点
        Args:
            node: 节点名称
        Returns:
            bool: 设置成功返回 True
        """
        
        
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return False
        
        
        if isinstance(node, dict):
            self._current_dict_node = node
            self._current_node = None
            
            return True
        
        
        self._ensure_node(node)
        self._current_node = node
        self._current_dict_node = None
        
        return True
    def setx(self,node,key,value):
        return self.set(key, value, node)
    def set(self, key: str, value: Any, node: Optional[str] = None,save=False) -> bool:
        """
        设置键值对
        
        Args:
            key: 键名
            value: 值
            node: 节点名称(如果为 None,使用当前节点)
            
        Returns:
            bool: 设置成功返回 True
        """
        # with Lock():
        #     if not self.is_loaded:
        #         print(f"{self._prefix} 错误: 未加载数据")
        #         return False
        
        
        if self._current_dict_node is not None:
            self._current_dict_node[key] = value
            if self._auto_save or save:
                self.save()
            return True
        
        
        
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return False
        
        
        
        target_node = node if node is not None else self._current_node
        
        if target_node is None:
            print(f"{self._prefix} 错误: 未指定节点")
            return False
        
        try:
            # 如果指定了不同的节点,确保该节点存在
            if node is not None:
                self._ensure_node(node)
            
            self._data[target_node][key] = value
            
            if self._auto_save or save:
                self.save()
            
            return True
        except Exception as e:
            print(f"{self._prefix} 设置键值时出错: {e}")
            return False
    def getx(self,node: Optional[str] , key: str, default: Any = None) -> Any:
        return self.get(key, default, node)
    
    def get(self, key: str, default: Any = None, node: Optional[str] = None) -> Any:
        """
        获取键对应的值
        
        Args:
            key: 键名
            default: 默认值(当键不存在时返回)
            node: 节点名称(如果为 None,使用当前节点)
            
        Returns:
            键对应的值,或默认值
        """
        
        
        if self._current_dict_node is not None:
            return self._current_dict_node.get(key, default)
        
        
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return default
        
        target_node = node if node is not None else self._current_node
        
        if target_node is None:
            print(f"{self._prefix} 错误: 未指定节点")
            return default
        
        if target_node not in self._data:
            return default
        
        return self._data[target_node].get(key, default)
    
    def delete(self, key: str, node: Optional[str] = None) -> bool:
        """
        删除指定键
        
        Args:
            key: 键名
            node: 节点名称(如果为 None,使用当前节点)
            
        Returns:
            bool: 删除成功返回 True
        """
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return False
        
        target_node = node if node is not None else self._current_node
        
        if target_node is None or target_node not in self._data:
            return False
        
        try:
            if key in self._data[target_node]:
                del self._data[target_node][key]
                
                if self._auto_save:
                    self.save()
                
                return True
            return False
        except Exception as e:
            print(f"{self._prefix} 删除键时出错: {e}")
            return False
    
    def set_auto_save(self, enabled: bool) -> None:
        """
        设置自动保存状态
        
        Args:
            enabled: True 启用自动保存, False 禁用
        """
        self._auto_save = enabled
    
    def save(self, file_path: Optional[str] = None) -> bool:
        """
        保存数据到文件
        
        Args:
            file_path: 文件路径(如果为 None,使用加载时的路径)
            
        Returns:
            bool: 保存成功返回 True
        """
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return False
        
        target_path = Path(file_path) if file_path else self._file_path
        
        if self._auto_save and target_path is None:
            return False
        
        if target_path is None:
            print(f"{self._prefix} 错误: 未指定文件路径")
            return False
        
        try:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            json_str = json.dumps(self._data, indent=4, ensure_ascii=False)
            target_path.write_text(json_str, encoding='utf-8')
            return True
        except Exception as e:
            print(f"{self._prefix} 保存文件时出错: {e}")
            return False
    
    def to_string(self, indent: int = 4) -> Optional[str]:
        """
        将数据转换为 JSON 字符串
        Args:
            indent: 缩进空格数
            
        Returns:
            JSON 字符串,失败返回 None
        """
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return None
        
        try:
            return json.dumps(self._data, indent=indent, ensure_ascii=False)
        except Exception as e:
            print(f"{self._prefix} 转换字符串时出错: {e}")
            return None
    
    def print_data(self) -> None:
        """打印当前数据"""
        if not self.is_loaded:
            print(f"{self._prefix} 错误: 未加载数据")
            return
        
        print(json.dumps(self._data, indent=2, ensure_ascii=False))
    
    def get_node_keys(self, node: Optional[str] = None) -> list:
        """
        获取节点中的所有键
        
        Args:
            node: 节点名称(如果为 None,使用当前节点)
            
        Returns:
            键列表
        """
        if not self.is_loaded:
            return []
        
        target_node = node if node is not None else self._current_node
        
        if target_node is None or target_node not in self._data:
            return []
        
        return list(self._data[target_node].keys())
    
    def node_exists(self, node: str) -> bool:
        """
        检查节点是否存在
        
        Args:
            node: 节点名称
            
        Returns:
            bool: 节点存在返回 True
        """
        return self.is_loaded and node in self._data
    
    def clear_node(self, node: Optional[str] = None) -> bool:
        """
        清空节点数据
        
        Args:
            node: 节点名称(如果为 None,使用当前节点)
            
        Returns:
            bool: 操作成功返回 True
        """
        if not self.is_loaded:
            return False
        
        target_node = node if node is not None else self._current_node
        
        if target_node is None:
            return False
        
        try:
            self._data[target_node] = {}
            
            if self._auto_save:
                self.save()
            
            return True
        except Exception as e:
            print(f"{self._prefix} 清空节点时出错: {e}")
            return False





if __name__=="__main__":
    pass
    # scerr_set_savepath("xxff.txt")
    print("")
    scerr_set_savepath(r"q",r"w",r"A:\临时目录\新建文件夹\***g","")
    scerr("error:2025-11-8 14:23:17")
    scerr("error:2025-11-8 14:23:17")
    scerr("error:2025-11-8 14:23:1722")
    scerr("error:2025-11-8 14:23:1722")
    scerr("error:2025-11-8 14:23:1722")
    scerr("error:2025-11-8 14:23:1722")
    scerr("error:2025-11-8 14:23:1722")
    ss_set_savepath(r"ss")
    ss("vvvvvvvvv",xgetCurrentDateTime())
    # ssClass.saveNow()
    # scc(xWriteFileStr_add_unlock(r"xxww.w","test"))
    
    time.sleep(10000000)