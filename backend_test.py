import requests
import sys
import time
from datetime import datetime

class SpeedTestAPITester:
    def __init__(self, base_url="https://modern-librespeed.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, stream=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            start_time = time.time()
            
            if method == 'GET':
                response = requests.get(url, headers=headers, stream=stream, timeout=30)
            elif method == 'POST':
                if data:
                    response = requests.post(url, data=data, headers={'Content-Type': 'application/octet-stream'}, timeout=30)
                else:
                    response = requests.post(url, json={}, headers=headers, timeout=30)

            end_time = time.time()
            duration = end_time - start_time

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}, Duration: {duration:.2f}s")
                
                # For streaming responses, check if we can read some data
                if stream and response.status_code == 200:
                    try:
                        # Read first 1KB to verify streaming works
                        chunk = next(response.iter_content(chunk_size=1024))
                        print(f"   📊 Streaming data received: {len(chunk)} bytes")
                    except Exception as e:
                        print(f"   ⚠️  Streaming read error: {e}")
                
                return True, response
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    print("   Could not read response text")
                return False, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        if success:
            try:
                data = response.json()
                print(f"   📋 Response: {data}")
            except:
                print("   ⚠️  Could not parse JSON response")
        return success

    def test_ping_endpoint(self):
        """Test ping endpoint for latency measurement"""
        success, response = self.run_test(
            "Ping Endpoint",
            "GET",
            f"ping?t={int(time.time() * 1000)}",
            200
        )
        if success:
            try:
                data = response.json()
                if 'timestamp' in data:
                    print(f"   📊 Timestamp received: {data['timestamp']}")
                else:
                    print("   ⚠️  No timestamp in response")
            except:
                print("   ⚠️  Could not parse JSON response")
        return success

    def test_download_endpoint(self):
        """Test download endpoint for speed measurement"""
        success, response = self.run_test(
            "Download Endpoint (Streaming)",
            "GET",
            f"download?t={int(time.time() * 1000)}",
            200,
            stream=True
        )
        
        if success:
            # Test streaming capability
            try:
                total_bytes = 0
                chunk_count = 0
                start_time = time.time()
                
                for chunk in response.iter_content(chunk_size=1024*1024):  # 1MB chunks
                    total_bytes += len(chunk)
                    chunk_count += 1
                    
                    # Stop after 5MB or 3 seconds to avoid long test
                    if total_bytes >= 5*1024*1024 or time.time() - start_time > 3:
                        break
                
                duration = time.time() - start_time
                speed_mbps = (total_bytes * 8) / (duration * 1000000)
                
                print(f"   📊 Downloaded: {total_bytes/1024/1024:.1f}MB in {duration:.1f}s")
                print(f"   📊 Speed: {speed_mbps:.1f} Mbps")
                print(f"   📊 Chunks received: {chunk_count}")
                
            except Exception as e:
                print(f"   ⚠️  Streaming test error: {e}")
        
        return success

    def test_upload_endpoint(self):
        """Test upload endpoint"""
        # Generate 1MB of test data
        test_data = b'x' * (1024 * 1024)
        
        success, response = self.run_test(
            "Upload Test Endpoint",
            "POST",
            "upload-test",
            200,
            data=test_data
        )
        
        if success:
            try:
                data = response.json()
                print(f"   📊 Upload response: {data}")
                if 'received' in data:
                    received_mb = data['received'] / (1024 * 1024)
                    print(f"   📊 Data received by server: {received_mb:.1f}MB")
            except:
                print("   ⚠️  Could not parse JSON response")
        
        return success

    def test_multiple_ping_requests(self):
        """Test multiple ping requests to simulate real usage"""
        print(f"\n🔍 Testing Multiple Ping Requests (10 iterations)...")
        
        ping_times = []
        successful_pings = 0
        
        for i in range(10):
            try:
                start_time = time.time()
                response = requests.get(f"{self.api_url}/ping?t={int(time.time() * 1000)}", timeout=5)
                end_time = time.time()
                
                if response.status_code == 200:
                    ping_time = (end_time - start_time) * 1000  # Convert to ms
                    ping_times.append(ping_time)
                    successful_pings += 1
                    print(f"   Ping {i+1}: {ping_time:.1f}ms")
                else:
                    print(f"   Ping {i+1}: Failed (Status: {response.status_code})")
                
                time.sleep(0.1)  # Small delay between pings
                
            except Exception as e:
                print(f"   Ping {i+1}: Error - {e}")
        
        self.tests_run += 1
        if successful_pings >= 8:  # Allow 2 failures out of 10
            self.tests_passed += 1
            avg_ping = sum(ping_times) / len(ping_times) if ping_times else 0
            print(f"✅ Passed - {successful_pings}/10 successful, Avg: {avg_ping:.1f}ms")
            return True
        else:
            print(f"❌ Failed - Only {successful_pings}/10 successful")
            return False

def main():
    print("🚀 Starting SpeedTest API Testing...")
    print("=" * 50)
    
    # Setup
    tester = SpeedTestAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_ping_endpoint,
        tester.test_multiple_ping_requests,
        tester.test_download_endpoint,
        tester.test_upload_endpoint,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())